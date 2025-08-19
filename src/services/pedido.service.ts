import fs from "fs";
import { Types } from "mongoose";
import { PedidoRepository } from "../repositories/pedido.repository";
import { IPedidoService } from "./contracts/pedido.service.contract";
import { IPedido } from "../interfaces/IPedido";

const toInt = (s: string) => {
  const n = parseInt(s.trim(), 10);
  return Number.isFinite(n) ? n : NaN;
};

export class PedidoService implements IPedidoService {
  private repository: PedidoRepository;
  constructor() { this.repository = new PedidoRepository(); }

  async create(data: Partial<IPedido>) { return this.repository.create(data); }
  async getAll() { return this.repository.findAll(); }
  async getById(id: string) { return this.repository.findById(id); }
  async update(id: string, data: Partial<IPedido>) { return this.repository.update(id, data); }
  async delete(id: string) { return this.repository.delete(id); }

  public async processFile(filePath: string, { user_register = "system" } = {}) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== "");

    const docs: Partial<IPedido>[] = lines.map((line) => {
      const user_id = toInt(line.slice(0, 10));
      const name = line.slice(11, 55).trim();
      const order_id = toInt(line.slice(55, 65));
      const product_id = toInt(line.slice(65, 75));
      const valueStr = line.slice(77, 87).trim().replace(",", ".");
      const value = Types.Decimal128.fromString(valueStr || "0");
      const rawDate = line.slice(87, 96).trim();
      const parsedDate =
        rawDate.length === 8
          ? new Date(`${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}T00:00:00Z`)
          : undefined;

      const doc: Partial<IPedido> = {
        user_id,
        name,
        order_id,
        product_id,
        value,
        date_register: new Date(),
        user_register,
        status: "Ativo",
      };
      if (parsedDate) doc.date = parsedDate;
      return doc;
    });

    const valid = docs.filter(
      (d) =>
        Number.isFinite(d.user_id as number) &&
        Number.isFinite(d.order_id as number) &&
        Number.isFinite(d.product_id as number) &&
        d.value instanceof Types.Decimal128 &&
        !!d.name &&
        d.date instanceof Date
    );

    const saveResult = await this.repository.addMany(valid);

    return {
      totalLines: lines.length,
      parsed: docs.length,
      valid: valid.length,
      ...saveResult,
    };
  }
}
