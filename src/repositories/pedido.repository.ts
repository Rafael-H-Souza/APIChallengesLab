import { PedidoModel } from "../models/pedido.model";
import { IPedido } from "../interfaces/IPedido";

export class PedidoRepository {
  async create(pedido: Partial<IPedido>) {
    return await PedidoModel.create(pedido);
  }

  async createMany(pedidos: Partial<IPedido>[]) {
    return await PedidoModel.insertMany(pedidos);
  }

  async findAll() {
    return await PedidoModel.find();
  }

  async findById(id: string) {
    return await PedidoModel.findById(id);
  }

  async update(id: string, data: Partial<IPedido>) {
    return await PedidoModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await PedidoModel.findByIdAndDelete(id);
  }
}

