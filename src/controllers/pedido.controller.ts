import { Request, Response } from "express";
import { PedidoService } from "../services/pedido.service";
import { PeriodoQuery, PeriodoQuerySchema } from "../validations/pedido.validation.schemas";

export class PedidoController {
  private service = new PedidoService();

  create = async (req: Request, res: Response) => {
    const data = await this.service.create(req.body);
    res.status(201).json(data);
  };

  getAll = async (_req: Request, res: Response) => {
    const data = await this.service.getAll();
    res.json(data);
  };

  getById = async (req: Request, res: Response) => {
    const id = req.params?.id as string | undefined;
    if (!id) return res.status(400).json({ message: "Parâmetro 'id' é obrigatório" });
    const data = await this.service.getById(id);
    if (!data) return res.status(404).json({ message: "Pedido não encontrado" });
    res.json(data);
  };

  update = async (req: Request, res: Response) => {
    const id = req.params?.id as string | undefined;
    if (!id) return res.status(400).json({ message: "Parâmetro 'id' é obrigatório" });
    const data = await this.service.update(id, req.body);
    if (!data) return res.status(404).json({ message: "Pedido não encontrado" });
    res.json(data);
  };

  delete = async (req: Request, res: Response) => {
    const id = req.params?.id as string | undefined;
    if (!id) return res.status(400).json({ message: "Parâmetro 'id' é obrigatório" });
    const data = await this.service.delete(id);
    if (!data) return res.status(404).json({ message: "Pedido não encontrado" });
    res.status(204).send();
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
