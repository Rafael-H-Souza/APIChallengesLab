import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { PedidoService } from "../services/pedido.service";

export class UploadController {
  private pedidoService: PedidoService;

  constructor() {
    this.pedidoService = new PedidoService();
  }

  public uploadFile = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Arquivo não enviado" });
      }

      const filePath = path.join(__dirname, "../../uploads", req.file.filename);

      const grouped = await this.pedidoService.processFile(filePath);

      return res.json({ 
        message: "Arquivo processado com sucesso", 
        data: grouped 
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };
}

  