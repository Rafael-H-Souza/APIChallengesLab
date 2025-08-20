import { Request, Response } from "express";
import { PedidoService } from "../services/pedido.service";
import { PedidoModel } from "../models/pedido.model";
import { PeriodoQuery, PeriodoQuerySchema } from "../validations/pedido.validation.schemas";

export class PedidoController {
  private service = new PedidoService();

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


  
    async getByPeriodo(req: Request, res: Response) {
      
    try {
      const { dataInicio, dataFim }:{ dataInicio?: string | any ; dataFim?: string  | any }= req.query as { dataInicio?: string; dataFim?: string };
      const pedidos = await this.service.findByPeriodo(dataInicio, dataFim )
      console.log("[CONTROLLER] datas recebidas:", dataInicio, dataFim);


      if (!pedidos || pedidos.length === 0) {
        return res.status(200).json({
          success: true,
          message: "Nenhum pedido encontrado nesse período",
          start: dataInicio,
          end: dataFim,
          data: []
        });
      }
       console.log("controller.findByPeriodo")
      return res.json({
        success: true,
        message: "Pedidos encontrados com sucesso",
        start: dataInicio,
        end: dataFim,
        data: pedidos
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message ?? "Erro interno" });
    }
  }
}



