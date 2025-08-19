"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoService = void 0;
const fs_1 = __importDefault(require("fs"));
const pedido_repository_1 = require("../repositories/pedido.repository");
const pedido_model_1 = require("../models/pedido.model");
class PedidoService {
    constructor() {
        this.repository = new pedido_repository_1.PedidoRepository();
    }
    async processFile(filePath, { user_register = "system" } = {}) {
        const raw = fs_1.default.readFileSync(filePath, "utf-8");
        const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== "");
        const docs = lines.map((line) => {
            const user_id = parseInt(line.slice(0, 10).trim(), 10);
            const name = line.slice(11, 55).trim();
            const order_id = parseInt(line.slice(55, 65).trim(), 10);
            const product_id = parseInt(line.slice(65, 75).trim(), 10);
            const valueStr = line.slice(77, 87).trim();
            const valueDecimal128 = (0, pedido_model_1.toMoney)(typeof valueStr === "string" ? valueStr : "0.00");
            const rawDate = line.slice(87, 95).trim();
            const iso = rawDate.length === 8
                ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
                : undefined;
            const date = iso ? new Date(`${iso}T00:00:00.000Z`) : new Date();
            return {
                user_id,
                name,
                order_id,
                product_id,
                value: valueDecimal128,
                date,
                date_register: new Date(),
                user_register,
                date_update: new Date(),
                user_update: user_register,
                status: "Ativo",
            };
        });
        if (docs.length === 0)
            return { inserted: 0 };
        const result = await this.repository.createMany(docs);
        return { inserted: Array.isArray(result) ? result.length : 0 };
    }
    async create(pedido) {
        return this.repository.create(pedido);
    }
    async getAll() {
        return this.repository.findAll();
    }
    async getById(id) {
        return this.repository.findById(id);
    }
    async update(id, data) {
        return this.repository.update(id, data);
    }
    async delete(id) {
        return this.repository.delete(id);
    }
}
exports.PedidoService = PedidoService;
