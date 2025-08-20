"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoService = void 0;
const pedido_repository_1 = require("../repositories/pedido.repository");
const isValidDate = (d) => !isNaN(d.getTime());
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const setStartOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const setEndOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const MAX_LIMIT = 200;
const MAX_RANGE_DAYS = 366;
class PedidoService {
    constructor() {
        this.repository = new pedido_repository_1.PedidoRepository();
    }
    async findByPeriodo(dataInicio, dataFim) {
        try {
            const start = new Date(dataInicio);
            const end = new Date(dataFim);
            console.log("[SERVICE] datas convertidas:", start, end);
            const pedidos = await this.repository.findByPeriodo(dataInicio, dataFim);
            console.log("[SERVICE] encontrados:", pedidos.length);
            return pedidos;
        }
        catch (err) {
            console.error("[SERVICE] erro:", err);
            throw err;
        }
    }
    async getByOrderId(orderId) {
        return this.repository.findByOrderId(orderId);
    }
    async listarPorOrderId(orderId, page, limit, sort) {
        return this.repository.findByOrderId(orderId);
    }
    async addMany(pedidos) {
        return await this.repository.addMany(pedidos);
    }
}
exports.PedidoService = PedidoService;
