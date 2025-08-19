"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoService = void 0;
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = require("mongoose");
const pedido_repository_1 = require("../repositories/pedido.repository");
const toInt = (s) => {
    const n = parseInt(s.trim(), 10);
    return Number.isFinite(n) ? n : NaN;
};
class PedidoService {
    constructor() { this.repository = new pedido_repository_1.PedidoRepository(); }
    async create(data) { return this.repository.create(data); }
    async getAll() { return this.repository.findAll(); }
    async getById(id) { return this.repository.findById(id); }
    async update(id, data) { return this.repository.update(id, data); }
    async delete(id) { return this.repository.delete(id); }
    async processFile(filePath, { user_register = "system" } = {}) {
        const raw = fs_1.default.readFileSync(filePath, "utf-8");
        const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== "");
        const docs = lines.map((line) => {
            const user_id = toInt(line.slice(0, 10));
            const name = line.slice(11, 55).trim();
            const order_id = toInt(line.slice(55, 65));
            const product_id = toInt(line.slice(65, 75));
            const valueStr = line.slice(77, 87).trim().replace(",", ".");
            const value = mongoose_1.Types.Decimal128.fromString(valueStr || "0");
            const rawDate = line.slice(87, 96).trim();
            const parsedDate = rawDate.length === 8
                ? new Date(`${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}T00:00:00Z`)
                : undefined;
            const doc = {
                user_id,
                name,
                order_id,
                product_id,
                value,
                date_register: new Date(),
                user_register,
                status: "Ativo",
            };
            if (parsedDate)
                doc.date = parsedDate;
            return doc;
        });
        const valid = docs.filter((d) => Number.isFinite(d.user_id) &&
            Number.isFinite(d.order_id) &&
            Number.isFinite(d.product_id) &&
            d.value instanceof mongoose_1.Types.Decimal128 &&
            !!d.name &&
            d.date instanceof Date);
        const saveResult = await this.repository.addMany(valid);
        return {
            totalLines: lines.length,
            parsed: docs.length,
            valid: valid.length,
            ...saveResult,
        };
    }
}
exports.PedidoService = PedidoService;
