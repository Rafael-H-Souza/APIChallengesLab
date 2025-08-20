"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoController = void 0;
const pedido_service_1 = require("../services/pedido.service");
class PedidoController {
    constructor() {
        this.service = new pedido_service_1.PedidoService();
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
    async getByPeriodo(req, res) {
        try {
            const { dataInicio, dataFim } = req.query;
            const pedidos = await this.service.findByPeriodo(dataInicio, dataFim);
            console.log("[CONTROLLER] datas recebidas:", dataInicio, dataFim);
            if (!pedidos || pedidos.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "Nenhum pedido encontrado nesse período",
                    start: dataInicio,
                    end: dataFim,
                    data: []
                });
            }
            console.log("controller.findByPeriodo");
            return res.json({
                success: true,
                message: "Pedidos encontrados com sucesso",
                start: dataInicio,
                end: dataFim,
                data: pedidos
            });
        }
        catch (err) {
            return res.status(500).json({ message: err.message ?? "Erro interno" });
        }
    }
}
exports.PedidoController = PedidoController;
