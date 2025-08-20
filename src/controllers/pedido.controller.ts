import { Request, Response } from "express";
import { PedidoService } from "../services/pedido.service";
import { PeriodoQuery, PeriodoQuerySchema } from "../validations/pedido.validation.schemas";

export class PedidoController {
  private service = new PedidoService();

  create = async (req: Request, res: Response) => {
    const data = await this.service.create(req.body);
    res.status(201).json(data);
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit ?? 20);
      const result = await this.service.getAll(limit);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };


  

  getById = async (req: Request, res: Response) => {
    try {
      const orderId = Number(req.params.orderId ?? req.query.orderId);
      if (!Number.isFinite(orderId)) return res.status(400).json({ message: "orderId inválido" });

      const page  = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 20);
      const sort  = (req.query.sort === "asc" ? "asc" : "desc") as "asc" | "desc";

      const data = await this.service.listarPorOrderId(orderId, page, limit, sort);
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  };




  async getByPeriodo(params: PeriodoQuery) {
    const parsed = PeriodoQuerySchema.safeParse(params);
    if (!parsed.success) {
      const error = new Error("Parâmetros inválidos no controller");
      (error as any).statusCode = 400;
      throw error;
    }
    return this.service.getByPeriodo(parsed.data);
  }
}
