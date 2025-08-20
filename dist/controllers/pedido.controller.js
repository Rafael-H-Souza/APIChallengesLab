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
        this.getAll = async (_req, res) => {
            const data = await this.service.getAll();
            res.json(data);
        };
        this.getById = async (req, res) => {
            const id = req.params?.id;
            if (!id)
                return res.status(400).json({ message: "Parâmetro 'id' é obrigatório" });
            const data = await this.service.getById(id);
            if (!data)
                return res.status(404).json({ message: "Pedido não encontrado" });
            res.json(data);
        };
        this.update = async (req, res) => {
            const id = req.params?.id;
            if (!id)
                return res.status(400).json({ message: "Parâmetro 'id' é obrigatório" });
            const data = await this.service.update(id, req.body);
            if (!data)
                return res.status(404).json({ message: "Pedido não encontrado" });
            res.json(data);
        };
        this.delete = async (req, res) => {
            const id = req.params?.id;
            if (!id)
                return res.status(400).json({ message: "Parâmetro 'id' é obrigatório" });
            const data = await this.service.delete(id);
            if (!data)
                return res.status(404).json({ message: "Pedido não encontrado" });
            res.status(204).send();
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
