"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoRepository = void 0;
const mongoose_1 = require("mongoose");
const pedido_model_1 = require("../models/pedido.model");
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
    async findAll(limit = 20) {
        try {
            const safeLimit = Math.min(100, Math.max(1, Number(limit)));
            const docs = await this.model
                .find({})
                .sort({ date: 1, _id: 1 }) // ASC por data; _id para desempate
                .limit(safeLimit)
                .lean();
            // Converter Decimal128 -> string quando usando .lean()
            const data = docs.map((it) => ({
                ...it,
                value: it?.value?.toString?.() ?? it?.value,
            }));
            return { success: true, message: "Pedidos encontrados com sucesso.", data };
        }
        catch (error) {
            return { success: false, message: "Erro ao buscar pedidos.", error: error.message };
        }
    }
    async findByOrderId(orderId) {
        return this.model.findOne({ order_id: orderId }).lean();
    }
    async findManyByMongoIds(ids) {
        const items = await pedido_model_1.PedidoModel.find({ _id: { $in: ids } }).lean();
        return items.map(it => ({ ...it, value: it.value?.toString?.() ?? it.value }));
    }
    async findByUserId(userId, opts) {
        const page = Math.max(1, opts?.page ?? 1);
        const limit = Math.min(100, Math.max(1, opts?.limit ?? 20));
        const sort = { date: (opts?.sort === "asc" ? 1 : -1), _id: 1 };
        const filter = { user_id: userId };
        const [items, total] = await Promise.all([
            pedido_model_1.PedidoModel.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
            pedido_model_1.PedidoModel.countDocuments(filter),
        ]);
        const norm = items.map(it => ({
            ...it,
            value: it.value?.toString?.() ?? it.value,
        }));
        return { total, page, limit, items: norm };
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
    async findByPeriodo({ dataInicio, dataFim, page, limit, order }) {
        if (!isValidDate(dataInicio) || !isValidDate(dataFim)) {
            const e = new Error("Datas inválidas recebidas no repositório.");
            e.statusCode = 400;
            throw e;
        }
        if (page < 1 || limit < 1) {
            const e = new Error("Paginação inválida.");
            e.statusCode = 400;
            throw e;
        }
        const dateField = "data";
        const filter = {
            [dateField]: { $gte: dataInicio, $lte: dataFim },
        };
        const sort = [[dateField, order === "asc" ? 1 : -1]];
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            pedido_model_1.PedidoModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
            pedido_model_1.PedidoModel.countDocuments(filter).exec(),
        ]);
        return { data, total };
    }
}
exports.PedidoRepository = PedidoRepository;
