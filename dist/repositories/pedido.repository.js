"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoRepository = void 0;
const pedido_model_1 = require("../models/pedido.model");
class PedidoRepository {
    async create(pedido) {
        return await pedido_model_1.PedidoModel.create(pedido);
    }
    async createMany(pedidos) {
        return await pedido_model_1.PedidoModel.insertMany(pedidos);
    }
    async findAll() {
        return await pedido_model_1.PedidoModel.find();
    }
    async findById(id) {
        return await pedido_model_1.PedidoModel.findById(id);
    }
    async update(id, data) {
        return await pedido_model_1.PedidoModel.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return await pedido_model_1.PedidoModel.findByIdAndDelete(id);
    }
}
exports.PedidoRepository = PedidoRepository;
