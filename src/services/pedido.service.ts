import { PedidoRepository } from "../repositories/pedido.repository";
import { IPedido } from "../interfaces/IPedido";

export class PedidoService {
  private repository: PedidoRepository;

  constructor() {
    this.repository = new PedidoRepository();
  }

  async create(pedido: Partial<IPedido>) {
    return await this.repository.create(pedido);
  }

  async getAll() {
    return await this.repository.findAll();
  }

  async getById(id: string) {
    return await this.repository.findById(id);
  }

  async update(id: string, data: Partial<IPedido>) {
    return await this.repository.update(id, data);
  }

  async delete(id: string) {
    return await this.repository.delete(id);
  }
}
                               