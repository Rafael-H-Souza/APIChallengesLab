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

  async getByPeriodo(params: PeriodoQuery) {
    let { dataInicio, dataFim, page, limit, order } = params;
    console.log("teste de busca de dados ")

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    if (!isValidDate(inicio) || !isValidDate(fim)) {
      const e = new Error("Parâmetros de data inválidos. Use o formato YYYY-MM-DD.");
      (e as any).statusCode = 400;
      throw e;
    }

    if (inicio > fim) {
      const e = new Error("A data inicial não pode ser maior que a data final.");
      (e as any).statusCode = 400;
      throw e;
    }

    const diffDays = Math.ceil((setEndOfDay(fim).getTime() - setStartOfDay(inicio).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > MAX_RANGE_DAYS) {
      const e = new Error(`Intervalo muito grande (${diffDays} dias). Máximo permitido: ${MAX_RANGE_DAYS} dias.`);
      (e as any).statusCode = 400;
      throw e;
    }

    page = clamp(Number(page || 1), 1, 1_000_000);
    limit = clamp(Number(limit || 20), 1, MAX_LIMIT);
    order = order === "asc" ? "asc" : "desc";

    const inicioDay = setStartOfDay(inicio);
    const fimDay = setEndOfDay(fim);

    const { data, total } = await this.repository.findByPeriodo({
      dataInicio: inicioDay,
      dataFim: fimDay,
      page,
      limit,
      order,
    });

    return {
      meta: {page,limit,total, totalPages: Math.ceil(total / limit) || 1, order,dataInicio: inicioDay.toISOString(),dataFim: fimDay.toISOString(),
      },
      data,
    };
  }

  async create(pedido: Partial<IPedido>) {
    return await this.repository.create(pedido);
  }

  async addMany(pedidos: Partial<IPedido>[]) {
    return await this.repository.addMany(pedidos);
  }

  
  async getByOrderId(orderId: number) {
    return this.repository.findByOrderId(orderId);
  }




  async listarPorOrderId(orderId: number, page?: number, limit?: number, sort?: "asc" | "desc") {
    return this.repository.findByOrderId(orderId);
  }

  async listarPorUserId(userId: number, page?: number, limit?: number, sort?: "asc" | "desc") {
    return this.repository.findByUserId(userId);
  }
}
                               