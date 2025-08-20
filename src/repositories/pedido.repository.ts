import { Model, SortOrder, Types, Document } from "mongoose";
import { IPedido } from "../interfaces/IPedido";
import { PedidoModel } from "../models/pedido.model";

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


  async findAll(limit = 20) {
    try {
      const safeLimit = Math.min(100, Math.max(1, Number(limit)));

      const docs = await this.model
        .find({})
        .sort({ date: 1, _id: 1 }) // ASC por data; _id para desempate
        .limit(safeLimit)
        .lean();

      // Converter Decimal128 -> string quando usando .lean()
      const data = docs.map((it: any) => ({
        ...it,
        value: it?.value?.toString?.() ?? it?.value,
      }));

      return { success: true, message: "Pedidos encontrados com sucesso.", data };
    } catch (error: any) {
      return { success: false, message: "Erro ao buscar pedidos.", error: error.message };
    }
  }


  async findByOrderId(orderId: number, opts?: { page?: number; limit?: number; sort?: "asc" | "desc" }) {
    const page  = Math.max(1, opts?.page ?? 1);
    const limit = Math.min(100, Math.max(1, opts?.limit ?? 20));
    const sort  = { date: (opts?.sort === "asc" ? 1 : -1) as 1 | -1, _id: 1 as 1 };

    const filter = { order_id: orderId };

    const [items, total] = await Promise.all([
      PedidoModel.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),               // rápido, mas atenção ao Decimal128
      PedidoModel.countDocuments(filter),
    ]);

    // Em .lean(), Decimal128 não passa pelo transform do schema:
    const norm = items.map(it => ({
      ...it,
      value: (it as any).value?.toString?.() ?? (it as any).value,
    }));

    return { total, page, limit, items: norm };
  }

  // Se quiser por lista de Mongo _id:
  async findManyByMongoIds(ids: string[]) {
    const items = await PedidoModel.find({ _id: { $in: ids } }).lean();
    return items.map(it => ({ ...it, value: (it as any).value?.toString?.() ?? (it as any).value }));
  }

 
  async findByUserId(userId: number, opts?: { page?: number; limit?: number; sort?: "asc" | "desc" }) {
    const page  = Math.max(1, opts?.page ?? 1);
    const limit = Math.min(100, Math.max(1, opts?.limit ?? 20));
    const sort  = { date: (opts?.sort === "asc" ? 1 : -1) as 1 | -1, _id: 1 as 1 };

    const filter = { user_id: userId };

    const [items, total] = await Promise.all([
      PedidoModel.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
      PedidoModel.countDocuments(filter),
    ]);

    const norm = items.map(it => ({
      ...it,
      value: (it as any).value?.toString?.() ?? (it as any).value,
    }));

    return { total, page, limit, items: norm };
  }

  
   
  async addMany(docs: Partial<IPedido>[]): Promise<AddManyResult> {
    console.log("teste de salvar")
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
