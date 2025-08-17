import { PedidoModel } from "../models/pedido.model";
import { IPedido } from "../interfaces/IPedido";

export class PedidoRepository {
  async create(pedido: Partial<IPedido>): Promise<IPedido> {
    return PedidoModel.create(pedido);
  }

  async findAll(): Promise<IPedido[]> {
    return PedidoModel.find();
  }

  async findById(id: string): Promise<IPedido | null> {
    return PedidoModel.findById(id);
  }

  async update(id: string, data: Partial<IPedido>): Promise<IPedido | null> {
    return PedidoModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IPedido | null> {
    return PedidoModel.findByIdAndDelete(id);
  }
}

