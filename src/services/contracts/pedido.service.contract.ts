import { IPedido } from "../../interfaces/IPedido";

export interface IPedidoService {
  create(data: Partial<IPedido>): Promise<any>;
  getAll(): Promise<any[]>;
  getById(id: string): Promise<any | null>;
  update(id: string, data: Partial<IPedido>): Promise<any | null>;
  delete(id: string): Promise<any | null>;
  processFile(filePath: string, opts?: { user_register?: string }): Promise<any>;
}
