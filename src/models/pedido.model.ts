
import { Schema, model } from "mongoose";
import { IPedido } from "../interfaces/IPedido";

const PedidoSchema = new Schema<IPedido>(
  {
    use_id: { type: Number, required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true },
    products: { type: Object, required: true },
    total: { type: Number, required: true },
    date: { type: Date, required: true },

    date_registe: { type: Date, default: Date.now },
    user_registe: { type: String, required: true },
    date_update: { type: Date, default: Date.now },
    user_update: { type: String, required: true },
    status: { type: String, enum: ["Ativo", "Inativo", "Erro"], default: "Ativo" },
  },
  { timestamps: true }
);

export const PedidoModel = model<IPedido>("Pedido", PedidoSchema);
