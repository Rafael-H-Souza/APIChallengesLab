import { Request, Response } from "express";
import { PedidoService } from "../services/pedido.service";

export class PedidoController {
  private service: PedidoService;

  constructor() {
    this.service = new PedidoService();
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const pedido = await this.service.create(req.body);
      return res.status(201).json(pedido);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  public getAll = async  (req: Request, res: Response) : Promise<Response> => {
    try {
      const pedidos = await this.service.getAll();
      return res.json(pedidos);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = req.params.id as string; // força string
      const pedido = await this.service.getById(id);

      if (!pedido) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }
      return res.json(pedido);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = req.params.id as string;
      const pedido = await this.service.update(id, req.body);

      if (!pedido) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }
      return res.json(pedido);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = req.params.id as string;
      const pedido = await this.service.delete(id);

      if (!pedido) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }
      return res.json({ message: "Pedido removido com sucesso" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };
}
