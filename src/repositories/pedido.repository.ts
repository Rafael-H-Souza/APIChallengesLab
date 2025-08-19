import { Model } from "mongoose";
import { IPedido } from "../interfaces/IPedido";
import { PedidoModel } from "../models/pedido.model"; 

export class PedidoRepository {
  private model: Model<IPedido>;
  constructor() { this.model = PedidoModel; }

  async create(data: Partial<IPedido>) { return this.model.create(data); }
  async findAll() { return this.model.find().lean(); }
  async findById(id: string) { return this.model.findById(id).lean(); }
  async update(id: string, data: Partial<IPedido>) { return this.model.findByIdAndUpdate(id, data, { new: true }).lean(); }
  async delete(id: string) { return this.model.findByIdAndDelete(id).lean(); }

  async addMany(docs: Partial<IPedido>[]) {
    if (!docs.length) return { inserted: 0, duplicated: 0, errors: [], raw: [] };
    try {
      const res: any = await (this.model as any).insertMany(docs, { ordered: false, rawResult: true });
      const inserted = res?.insertedCount ?? (Array.isArray(res) ? res.length : 0);
      return { inserted, duplicated: 0, errors: [], raw: res };
    } catch (err: any) {
      const writeErrors = err?.writeErrors ?? [];
      const duplicated = writeErrors.filter((e: any) => e?.code === 11000).length;
      const otherErrors = writeErrors.filter((e: any) => e?.code !== 11000).map((e: any) => e?.errmsg ?? e?.message);
      const inserted = err?.result?.nInserted ?? 0;
      return { inserted, duplicated, errors: otherErrors, raw: err?.result ?? null };
    }
  }
}
