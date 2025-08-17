import {Document } from "mongoose"

type Status = "Ativo"| "Inativo" | "Erro";

export interface IPedido extends Document {
  use_id: number;
  name: string;
  order: number;
  products: {};
  total:number;
  date: Date;

  date_registe: Date;
  user_registe: string;
  date_update: Date;
  user_update: string;
  status: Status;

}

// id usuário 10 numérico
// nome 45 texto
// id pedido 10 numérico
// id produto 10 numérico
// valor do produto 12 decimal
// data compra 8 numérico ( formato: yyyymmdd )