import { Request, Response } from "express";
import { PedidoService } from "../services/pedido.service";
import { PedidoModel } from "../models/pedido.model";
import { PeriodoQuery, PeriodoQuerySchema } from "../validations/pedido.validation.schemas";

export class PedidoController {
  private service = new PedidoService();

  create = async (req: Request, res: Response) => {
    const data = await this.service.create(req.body);
    res.status(201).json(data);
  };

  

  
  

  getById = async (req: Request, res: Response) => {
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
