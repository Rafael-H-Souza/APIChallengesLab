"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoController = void 0;
const pedido_service_1 = require("../services/pedido.service");
const pedido_validation_schemas_1 = require("../validations/pedido.validation.schemas");
class PedidoController {
    constructor() {
        this.service = new pedido_service_1.PedidoService();
        this.create = async (req, res) => {
            const data = await this.service.create(req.body);
            res.status(201).json(data);
        };
        this.getAll = async (req, res) => {
            try {
                const limit = Number(req.query.limit ?? 20);
                const result = await this.service.getAll(limit);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        };
        this.getById = async (req, res) => {
            try {
                const orderId = Number(req.params.orderId ?? req.query.orderId);
                if (!Number.isFinite(orderId))
                    return res.status(400).json({ message: "orderId inválido" });
                const page = Number(req.query.page ?? 1);
                const limit = Number(req.query.limit ?? 20);
                const sort = (req.query.sort === "asc" ? "asc" : "desc");
                const data = await this.service.listarPorOrderId(orderId, page, limit, sort);
                return res.json(data);
            }
            catch (e) {
                return res.status(500).json({ message: e.message });
            }
        };
    }
    async getByPeriodo(params) {
        const parsed = pedido_validation_schemas_1.PeriodoQuerySchema.safeParse(params);
        if (!parsed.success) {
            const error = new Error("Parâmetros inválidos no controller");
            error.statusCode = 400;
            throw error;
        }
        return this.service.getByPeriodo(parsed.data);
    }
}
exports.PedidoController = PedidoController;
