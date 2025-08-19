import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { PedidoService } from "../services/pedido.service";


export class UploadController {
  private service = new PedidoService();

  upload = async (req: Request, res: Response) => {
    try {
      const filePath = (req as any).file?.path || req.body.filePath;
      if (!filePath) return res.status(400).json({ message: "Arquivo não enviado." });

      const user_register = (req as any).user?.email || "system";
      const result = await this.service.processFile(filePath, { user_register });

      res.status(201).json({ message: "Upload processado e salvo.", ...result });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  };
}