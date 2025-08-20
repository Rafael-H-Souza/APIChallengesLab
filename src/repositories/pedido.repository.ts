import { Model, SortOrder, Types, Document } from "mongoose";
import { IPedido } from "../interfaces/IPedido";
import { PedidoModel } from "../models/pedido.model";
import { PeriodoQuery } from "../validations/pedido.validation.schemas";

type PedidoPlain = Omit<IPedido, keyof Document>;                
type Insertable = Partial<PedidoPlain> & { _id: Types.ObjectId };

type AddManyResult = {
  success: boolean;
  message: string;
  inserted: number;
  duplicated: number;
  errors: string[];
  data: Insertable[]; 
};

type RepoParams = {
  dataInicio: Date;
  dataFim: Date;
  page: number;
  limit: number;
  order: "asc" | "desc";
};

const isValidDate = (d: Date) => !isNaN(d.getTime());

const isDefined = <T>(x: T | undefined | null): x is T => x != null;

export class PedidoRepository {
  private model: Model<IPedido>;
  constructor(model?: Model<IPedido>) {
    this.model = model ?? PedidoModel;
  }

  async create(data: Partial<IPedido>) {
    try {
      const result = await this.model.create(data);
      return { success: true, message: "Pedido criado com sucesso.", data: result };
    } catch (error: any) {
      return { success: false, message: "Erro ao criar pedido.", error: error.message };
    }
  }

  async findAll() {
    try {
      const result = await this.model.find().lean();
      return { success: true, message: "Pedidos encontrados com sucesso.", data: result };
    } catch (error: any) {
      return { success: false, message: "Erro ao buscar pedidos.", error: error.message };
    }
  }

  async findById(id: string) {
    try {
      const result = await this.model.findById(id).lean();
      if (!result) return { success: false, message: `Pedido com id ${id} não encontrado.` };
      return { success: true, message: "Pedido encontrado com sucesso.", data: result };
    } catch (error: any) {
      return { success: false, message: "Erro ao buscar pedido.", error: error.message };
    }
  }

  async update(id: string, data: Partial<IPedido>) {
    try {
      const result = await this.model.findByIdAndUpdate(id, data, { new: true }).lean();
      if (!result) return { success: false, message: `Pedido com id ${id} não encontrado para atualização.` };
      return { success: true, message: "Pedido atualizado com sucesso.", data: result };
    } catch (error: any) {
      return { success: false, message: "Erro ao atualizar pedido.", error: error.message };
    }
  }

  async delete(id: string) {
    try {
      const result = await this.model.findByIdAndDelete(id).lean();
      if (!result) return { success: false, message: `Pedido com id ${id} não encontrado para exclusão.` };
      return { success: true, message: "Pedido excluído com sucesso.", data: result };
    } catch (error: any) {
      return { success: false, message: "Erro ao excluir pedido.", error: error.message };
    }
  }
   
  async addMany(docs: Partial<IPedido>[]): Promise<AddManyResult> {
    if (!docs?.length) {
      return {
        success: true,
        message: "Nenhum documento para inserir.",
        inserted: 0,
        duplicated: 0,
        errors: [],
        data: []
      };
    }

   
    const docsWithId: Insertable[] = docs.map((d) => {
      const { _id: _ignore, ...rest } = (d ?? {}) as any;
      return {
        _id: new Types.ObjectId(),
        ...(rest as Omit<Partial<IPedido>, "_id">),
      };
    });

    try {
      const res: any = await this.model.collection.insertMany(docsWithId as any[], { ordered: false });

      const insertedIdx: number[] = Object.keys(res.insertedIds ?? {}).map(Number);
      const insertedDocs: Insertable[] = insertedIdx
        .map((i) => docsWithId[i])
        .filter(isDefined);

      return {
        success: true,
        message: `Pedidos inseridos com sucesso. (${insertedDocs.length} novo(s))`,
        inserted: insertedDocs.length,
        duplicated: 0,
        errors: [],
        data: insertedDocs
      };
    } catch (e: any) {
      const writeErrors = e?.writeErrors ?? [];
      const duplicated = writeErrors.filter((w: any) => w?.code === 11000).length;
      const otherErrors = writeErrors
        .filter((w: any) => w?.code !== 11000)
        .map((w: any) => w?.errmsg ?? w?.message ?? String(w));

      let insertedIdx: number[] = Object.keys(
        e?.result?.insertedIds ?? e?.result?.result?.insertedIds ?? {}
      ).map(Number);

      if (!insertedIdx.length && writeErrors.length) {
        const errorIdx = new Set(
          writeErrors.map((w: any) => w?.index).filter((i: any) => Number.isInteger(i))
        );
        insertedIdx = docsWithId.map((_, i) => i).filter((i) => !errorIdx.has(i));
      }

      const insertedDocs: Insertable[] = insertedIdx
        .map((i) => docsWithId[i])
        .filter(isDefined);

      const inserted = insertedDocs.length;
      const success = otherErrors.length === 0;

      return {
        success,
        message: success
          ? `Pedidos inseridos com duplicidades ignoradas. (${inserted} inserido(s), ${duplicated} duplicado(s))`
          : `Falhas parciais ao inserir. (${inserted} inserido(s), ${duplicated} duplicado(s), ${otherErrors.length} erro(s))`,
        inserted,
        duplicated,
        errors: otherErrors,
        data: insertedDocs
      };
    }
  }

  async findByPeriodo({ dataInicio, dataFim, page, limit, order }: RepoParams) {
    if (!isValidDate(dataInicio) || !isValidDate(dataFim)) {
      const e = new Error("Datas inválidas recebidas no repositório.");
      (e as any).statusCode = 400;
      throw e;
    }
    if (page < 1 || limit < 1) {
      const e = new Error("Paginação inválida.");
      (e as any).statusCode = 400;
      throw e;
    }
    const dateField = "data";
    const filter = {
      [dateField]: { $gte: dataInicio, $lte: dataFim },
    };
    const sort: [string, SortOrder][] = [[dateField, order === "asc" ? 1 : -1]];
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      PedidoModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      PedidoModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }
  
}
