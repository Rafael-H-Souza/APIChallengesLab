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
        this.getById = async (req, res) => {
            const orderId = Number(req.params.id);
            if (isNaN(orderId)) {
                return res.status(400).json({ message: "order_id inválido, deve ser número" });
            }
            const pedido = await this.service.getByOrderId(orderId);
            if (!pedido) {
                return res.status(404).json({ message: "Pedido não encontrado" });
            }
            return res.json(pedido);
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
