"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoRepository = void 0;
const pedido_model_1 = require("../models/pedido.model");
class PedidoRepository {
    async create(pedido) {
        return pedido_model_1.PedidoModel.updateOne({
            user_id: pedido.user_id,
            order_id: pedido.order_id,
            product_id: pedido.product_id,
            date: pedido.date,
        }, { $set: pedido }, { upsert: true });
    }
    async createMany(pedidos) {
        const ops = pedidos.map((p) => ({
            updateOne: {
                filter: {
                    user_id: p.user_id,
                    order_id: p.order_id,
                    product_id: p.product_id,
                    date: p.date,
                },
                update: { $set: p },
                upsert: true,
            },
        }));
        return pedido_model_1.PedidoModel.bulkWrite(ops);
    }
    async findAll() {
        return pedido_model_1.PedidoModel.find({});
    }
    async findById(id) {
        return pedido_model_1.PedidoModel.findById(id);
    }
    async update(id, data) {
        data.date_update = new Date();
        return pedido_model_1.PedidoModel.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return pedido_model_1.PedidoModel.findByIdAndDelete(id);
    }
}
exports.PedidoRepository = PedidoRepository;
