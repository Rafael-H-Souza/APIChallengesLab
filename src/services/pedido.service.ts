import { PedidoRepository } from "../repositories/pedido.repository";
import { IPedido } from "../interfaces/IPedido";
import { PeriodoQuery, PeriodoQuerySchema } from "../validations/pedido.validation.schemas";


const isValidDate = (d: Date) => !isNaN(d.getTime());
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const setStartOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const setEndOfDay   = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const MAX_LIMIT = 200;
const MAX_RANGE_DAYS = 366;

export class PedidoService {
  private repository: PedidoRepository;

  constructor() {
    this.repository = new PedidoRepository();
  }

  
  async findByPeriodo(dataInicio: string, dataFim: string) {
    try {
      const start = new Date(dataInicio);
      const end = new Date(dataFim);

      console.log("[SERVICE] datas convertidas:", start, end);


      const pedidos = await  this.repository.findByPeriodo(dataInicio, dataFim);
      console.log("[SERVICE] encontrados:", pedidos.length);
      return pedidos;
    } catch (err) {
      console.error("[SERVICE] erro:", err);
      throw err;
    }
  }


  
  
  async getByOrderId(orderId: number) {
    return this.repository.findByOrderId(orderId);
  }

  async listarPorOrderId(orderId: number, page?: number, limit?: number, sort?: "asc" | "desc") {
    return this.repository.findByOrderId(orderId);
  }

                               
  async addMany(pedidos: Partial<IPedido>[]) {
    return await this.repository.addMany(pedidos);
  }

  
  

  
}
                               