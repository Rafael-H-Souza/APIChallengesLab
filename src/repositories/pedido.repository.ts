// src/repositories/pedido.repository.ts
import { Model } from "mongoose";
import { PedidoModel } from "../models/pedido.model";
import { IPedido } from "../interfaces/IPedido";

export class PedidoRepository {
  private model: Model<IPedido>;

  constructor() {
    this.model = PedidoModel;
  }

  async addMany(docs: Partial<IPedido>[]) {
    if (!docs.length) {
      return { inserted: 0, duplicated: 0, errors: [], raw: [] };
    }

    try {
      const insertedDocs = await this.model.insertMany(docs, {
        ordered: false,         
        rawResult: true,         
        lean: true
      } as any);

 
      const inserted =
        (insertedDocs as any)?.insertedCount ??
        (Array.isArray(insertedDocs) ? insertedDocs.length : 0);

      return { inserted, duplicated: 0, errors: [], raw: insertedDocs };
    } catch (err: any) {
      const writeErrors = err?.writeErrors ?? [];
      const duplicated = writeErrors.filter((e: any) => e?.code === 11000).length;
      const otherErrors = writeErrors.filter((e: any) => e?.code !== 11000).map((e: any) => e?.errmsg ?? e?.message);

      const inserted = err?.result?.nInserted ?? 0;

      return { inserted, duplicated, errors: otherErrors, raw: err?.result ?? null };
    }
  }
}
