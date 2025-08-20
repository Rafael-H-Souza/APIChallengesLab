import { Model, SortOrder, Types, Document } from "mongoose";
import { IPedido } from "../interfaces/IPedido";
import { PedidoModel } from "../models/pedido.model";
import { transformPedidos } from "../utils/pedido.parser";

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
   




  async findByOrderId(orderId: number) {
    const docs = await this.model.find({ order_id: orderId }).sort({ date: 1 }).lean();
    return transformPedidos(docs);
  }
      async findByPeriodo(dataInicio: string, dataFim: string) {
          console.log("[REPO] convertendo datas:", dataInicio, dataFim);

          const start = new Date(`${dataInicio}T00:00:00.000Z`);
          const end = new Date(`${dataFim}T23:59:59.999Z`);

          const docs = await this.model.find(
            { date: { $gte: start, $lte: end } }, 
            { 
              user_id: 1, 
              order_id: 1, 
              product_id: 1, 
              value: 1, 
              date: 1,
              name: 1   
            } 
          )
          .sort({ date: -1 })   
          .limit(100)          
          .lean();

          console.log("[REPOPOSITORY] encontrados:", docs.length);
  
          const dados  = await transformPedidos(docs);
          return dados;
        }



  
    async findByPeriodo2(start: Date, end: Date): Promise<IPedido[]> {
      console.log("[REPO] convertendo datas:", start, end);

           start = new Date(`${start}T00:00:00.000Z`);
           end = new Date(`${end}T23:59:59.999Z`);
          
          const docs = await this.model
          .find({ date: { $gte: start, $lte: end } })
          .sort({ date: 1 })
          .lean();
          
          const dado = await transformPedidos(docs);
      return dado
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

}
