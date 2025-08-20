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
    async getByPeriodo(params) {
        let { dataInicio, dataFim, page, limit, order } = params;
        console.log("teste de busca de dados ");
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        if (!isValidDate(inicio) || !isValidDate(fim)) {
            const e = new Error("Parâmetros de data inválidos. Use o formato YYYY-MM-DD.");
            e.statusCode = 400;
            throw e;
        }
        if (inicio > fim) {
            const e = new Error("A data inicial não pode ser maior que a data final.");
            e.statusCode = 400;
            throw e;
        }
        const diffDays = Math.ceil((setEndOfDay(fim).getTime() - setStartOfDay(inicio).getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > MAX_RANGE_DAYS) {
            const e = new Error(`Intervalo muito grande (${diffDays} dias). Máximo permitido: ${MAX_RANGE_DAYS} dias.`);
            e.statusCode = 400;
            throw e;
        }
        page = clamp(Number(page || 1), 1, 1000000);
        limit = clamp(Number(limit || 20), 1, MAX_LIMIT);
        order = order === "asc" ? "asc" : "desc";
        const inicioDay = setStartOfDay(inicio);
        const fimDay = setEndOfDay(fim);
        const { data, total } = await this.repository.findByPeriodo({
            dataInicio: inicioDay,
            dataFim: fimDay,
            page,
            limit,
            order,
        });
        return {
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1, order, dataInicio: inicioDay.toISOString(), dataFim: fimDay.toISOString(),
            },
            data,
        };
    }
    async create(pedido) {
        return await this.repository.create(pedido);
    }
    async addMany(pedidos) {
        return await this.repository.addMany(pedidos);
    }
    async getAll(limit) {
        return this.repository.findAll(limit);
    }
    async listarPorOrderId(orderId, page, limit, sort) {
        return this.repository.findByOrderId(orderId);
    }
    async listarPorUserId(userId, page, limit, sort) {
        return this.repository.findByUserId(userId);
    }
}
exports.PedidoService = PedidoService;
