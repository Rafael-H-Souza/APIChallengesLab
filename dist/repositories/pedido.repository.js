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
    async findAll() {
        try {
            const result = await this.model.find().lean();
            return { success: true, message: "Pedidos encontrados com sucesso.", data: result };
        }
        catch (error) {
            return { success: false, message: "Erro ao buscar pedidos.", error: error.message };
        }
    }
    async findById(id) {
        try {
            const result = await this.model.findById(id).lean();
            if (!result)
                return { success: false, message: `Pedido com id ${id} não encontrado.` };
            return { success: true, message: "Pedido encontrado com sucesso.", data: result };
        }
        catch (error) {
            return { success: false, message: "Erro ao buscar pedido.", error: error.message };
        }
    }
    async update(id, data) {
        try {
            const result = await this.model.findByIdAndUpdate(id, data, { new: true }).lean();
            if (!result)
                return { success: false, message: `Pedido com id ${id} não encontrado para atualização.` };
            return { success: true, message: "Pedido atualizado com sucesso.", data: result };
        }
        catch (error) {
            return { success: false, message: "Erro ao atualizar pedido.", error: error.message };
        }
    }
    async delete(id) {
        try {
            const result = await this.model.findByIdAndDelete(id).lean();
            if (!result)
                return { success: false, message: `Pedido com id ${id} não encontrado para exclusão.` };
            return { success: true, message: "Pedido excluído com sucesso.", data: result };
        }
        catch (error) {
            return { success: false, message: "Erro ao excluir pedido.", error: error.message };
        }
    }
    async addMany(docs) {
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
