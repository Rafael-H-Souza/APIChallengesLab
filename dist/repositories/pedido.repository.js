"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoRepository = void 0;
const pedido_model_1 = require("../models/pedido.model");
class PedidoRepository {
    constructor() { this.model = pedido_model_1.PedidoModel; }
    async create(data) { return this.model.create(data); }
    async findAll() { return this.model.find().lean(); }
    async findById(id) { return this.model.findById(id).lean(); }
    async update(id, data) { return this.model.findByIdAndUpdate(id, data, { new: true }).lean(); }
    async delete(id) { return this.model.findByIdAndDelete(id).lean(); }
    async addMany(docs) {
        if (!docs.length)
            return { inserted: 0, duplicated: 0, errors: [], raw: [] };
        try {
            const res = await this.model.insertMany(docs, { ordered: false, rawResult: true });
            const inserted = res?.insertedCount ?? (Array.isArray(res) ? res.length : 0);
            return { inserted, duplicated: 0, errors: [], raw: res };
        }
        catch (err) {
            const writeErrors = err?.writeErrors ?? [];
            const duplicated = writeErrors.filter((e) => e?.code === 11000).length;
            const otherErrors = writeErrors.filter((e) => e?.code !== 11000).map((e) => e?.errmsg ?? e?.message);
            const inserted = err?.result?.nInserted ?? 0;
            return { inserted, duplicated, errors: otherErrors, raw: err?.result ?? null };
        }
    }
}
exports.PedidoRepository = PedidoRepository;
