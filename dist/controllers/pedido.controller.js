"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoController = void 0;
const pedido_service_1 = require("../services/pedido.service");
class PedidoController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const pedido = await this.service.create(req.body);
                return res.status(201).json(pedido);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        };
        this.getAll = async (req, res) => {
            try {
                const pedidos = await this.service.getAll();
                return res.json(pedidos);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        };
        this.getById = async (req, res) => {
            try {
                const id = req.params.id;
                const pedido = await this.service.getById(id);
                if (!pedido) {
                    return res.status(404).json({ message: "Pedido não encontrado" });
                }
                return res.json(pedido);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        };
        this.update = async (req, res) => {
            try {
                const id = req.params.id;
                const pedido = await this.service.update(id, req.body);
                if (!pedido) {
                    return res.status(404).json({ message: "Pedido não encontrado" });
                }
                return res.json(pedido);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        };
        this.delete = async (req, res) => {
            try {
                const id = req.params.id;
                const pedido = await this.service.delete(id);
                if (!pedido) {
                    return res.status(404).json({ message: "Pedido não encontrado" });
                }
                return res.json({ message: "Pedido removido com sucesso" });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        };
        this.service = new pedido_service_1.PedidoService();
    }
}
exports.PedidoController = PedidoController;
