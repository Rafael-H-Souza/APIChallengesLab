"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoRepository = void 0;
const mongoose_1 = require("mongoose");
const pedido_model_1 = require("../models/pedido.model");
const pedido_parser_1 = require("../utils/pedido.parser");
const isValidDate = (d) => !isNaN(d.getTime());
const isDefined = (x) => x != null;
class PedidoRepository {
    constructor(model) {
        this.model = model ?? pedido_model_1.PedidoModel;
    }
    async create(data) {
        try {
            const result = await this.model.create(data);
            return { success: true, message: "Pedido criado com sucesso.", data: result };
        }
        catch (error) {
            return { success: false, message: "Erro ao criar pedido.", error: error.message };
        }
    }
    async findByOrderId(orderId) {
        const docs = await this.model.find({ order_id: orderId }).sort({ date: 1 }).lean();
        return (0, pedido_parser_1.transformPedidos)(docs);
    }
    async findByPeriodo(dataInicio, dataFim) {
        console.log("[REPO] convertendo datas:", dataInicio, dataFim);
        const start = new Date(`${dataInicio}T00:00:00.000Z`);
        const end = new Date(`${dataFim}T23:59:59.999Z`);
        const docs = await this.model.find({ date: { $gte: start, $lte: end } }, {
            user_id: 1,
            order_id: 1,
            product_id: 1,
            value: 1,
            date: 1,
            name: 1
        })
            .sort({ date: -1 })
            .limit(100)
            .lean();
        console.log("[REPOPOSITORY] encontrados:", docs.length);
        const dados = await (0, pedido_parser_1.transformPedidos)(docs);
        return dados;
    }
    async findByPeriodo2(start, end) {
        console.log("[REPO] convertendo datas:", start, end);
        start = new Date(`${start}T00:00:00.000Z`);
        end = new Date(`${end}T23:59:59.999Z`);
        const docs = await this.model
            .find({ date: { $gte: start, $lte: end } })
            .sort({ date: 1 })
            .lean();
        const dado = await (0, pedido_parser_1.transformPedidos)(docs);
        return dado;
    }
    async addMany(docs) {
        console.log("teste de salvar");
        if (!docs?.length) {
            return {
                success: true,
                message: "Nenhum documento para inserir.",
                inserted: 0,
                duplicated: 0,
                errors: [],
                data: []
            };
        }
        const docsWithId = docs.map((d) => {
            const { _id: _ignore, ...rest } = (d ?? {});
            return {
                _id: new mongoose_1.Types.ObjectId(),
                ...rest,
            };
        });
        try {
            const res = await this.model.collection.insertMany(docsWithId, { ordered: false });
            const insertedIdx = Object.keys(res.insertedIds ?? {}).map(Number);
            const insertedDocs = insertedIdx
                .map((i) => docsWithId[i])
                .filter(isDefined);
            return {
                success: true,
                message: `Pedidos inseridos com sucesso. (${insertedDocs.length} novo(s))`,
                inserted: insertedDocs.length,
                duplicated: 0,
                errors: [],
                data: insertedDocs
            };
        }
        catch (e) {
            const writeErrors = e?.writeErrors ?? [];
            const duplicated = writeErrors.filter((w) => w?.code === 11000).length;
            const otherErrors = writeErrors
                .filter((w) => w?.code !== 11000)
                .map((w) => w?.errmsg ?? w?.message ?? String(w));
            let insertedIdx = Object.keys(e?.result?.insertedIds ?? e?.result?.result?.insertedIds ?? {}).map(Number);
            if (!insertedIdx.length && writeErrors.length) {
                const errorIdx = new Set(writeErrors.map((w) => w?.index).filter((i) => Number.isInteger(i)));
                insertedIdx = docsWithId.map((_, i) => i).filter((i) => !errorIdx.has(i));
            }
            const insertedDocs = insertedIdx
                .map((i) => docsWithId[i])
                .filter(isDefined);
            const inserted = insertedDocs.length;
            const success = otherErrors.length === 0;
            return {
                success,
                message: success
                    ? `Pedidos inseridos com duplicidades ignoradas. (${inserted} inserido(s), ${duplicated} duplicado(s))`
                    : `Falhas parciais ao inserir. (${inserted} inserido(s), ${duplicated} duplicado(s), ${otherErrors.length} erro(s))`,
                inserted,
                duplicated,
                errors: otherErrors,
                data: insertedDocs
            };
        }
    }
}
exports.PedidoRepository = PedidoRepository;
