import { Document, Types } from "mongoose";

export type Status = "Ativo" | "Inativo" | "Erro";

export interface IPedidoBase {
  user_id: number;
  name: string;
  order_id: number;
  product_id: number;
  value: Types.Decimal128;
  date: Date;

  date_register?: Date;
  user_register?: string;
  date_update?: Date;
  user_update?: string;
  status?: Status;
}

export interface IPedido extends Document, IPedidoBase {}
