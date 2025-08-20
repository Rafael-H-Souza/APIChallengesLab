
import { Request, Response } from "express";
import { promises as fsp } from "fs";
import { Types } from "mongoose";       
import { PedidoService } from "../services/pedido.service";
import { IPedido } from "../interfaces/IPedido";

const toInt = (s: string) => {
  const n = parseInt(s.trim(), 10);
  return Number.isFinite(n) ? n : NaN;
};

const toDecimal128 = (s: string) => {
  const norm = s.trim().replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(norm)) return null;
  return Types.Decimal128.fromString(norm);
};

const parseDateYYYYMMDD = (raw: string): Date | undefined => {
  const v = raw.trim();
  if (v.length !== 8) return undefined;
  const y = v.slice(0, 4);
  const m = v.slice(4, 6);
  const d = v.slice(6, 8);
  const iso = `${y}-${m}-${d}T12:00:00.000Z`;
  const dt = new Date(iso);
  return isNaN(dt.getTime()) ? undefined : dt;
};

const parseLinesToPedidos = (lines: string[]): Partial<IPedido>[] =>
  lines
    .map((line) => {
      const user_id = toInt(line.slice(0, 10));
      const name = line.slice(11, 55).trim();
      const order_id = toInt(line.slice(55, 65));
      const product_id = toInt(line.slice(65, 75));
      const value = toDecimal128(line.slice(77, 87));
      const date = parseDateYYYYMMDD(line.slice(87, 96));

      return {
        user_id,
        name,
        order_id,
        product_id,
        value: value ?? undefined, // Types.Decimal128 | undefined
        date,                      // Date | undefined
      } as Partial<IPedido>;
    })
    .filter(
      (p) =>
        Number.isFinite(p.user_id as number) &&
        p.name &&
        Number.isFinite(p.order_id as number) &&
        Number.isFinite(p.product_id as number) &&
        p.value instanceof Types.Decimal128 &&
        p.date instanceof Date
    );



export class UploadController {
  private pedidoService: PedidoService = new PedidoService();

  public uploadFile = async (req: Request, res: Response): Promise<Response> => {
    if (!req.file) return res.status(400).json({ message: "Arquivo não enviado" });

    const filePath = (req.file as any).path ?? req.file.filename;
    try {
      const data = await fsp.readFile(filePath, "utf-8");
      const lines = data.split(/\r?\n/).filter((l) => l.trim() !== "");

      const pedidos = parseLinesToPedidos(lines);

      if (!pedidos.length) {
        return res.status(422).json({ message: "Nenhuma linha válida encontrada no arquivo." });
      }

      const result = await this.pedidoService.addMany(pedidos);
      return res.status(201).json({ message: "Arquivo processado com sucesso", count: pedidos.length, result });
    } catch (error: any) {
      return res.status(500).json({ message: error?.message ?? "Erro ao processar arquivo" });
    } finally {
      try { await fsp.unlink(filePath); } catch {}
    }
  };
}