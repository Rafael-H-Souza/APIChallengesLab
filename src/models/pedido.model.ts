
import mongoose, { Schema, Model, Types } from "mongoose";
import { IPedido } from "../interfaces/IPedido";

const PedidoSchema = new Schema<IPedido>(
  {
    user_id: { type: Number, required: true, index: true, immutable: true },
    name: { type: String, required: true, maxlength: 45, trim: true },
    order_id: { type: Number, required: true, index: true, immutable: true },
    product_id: { type: Number, required: true, index: true, immutable: true },

    
    value: { type: Schema.Types.Decimal128, required: true },

    date: { type: Date, required: true, immutable: true },

    date_register: { type: Date, default: () => new Date() },
    user_register: { type: String, default: "system", trim: true },
    date_update: { type: Date, default: () => new Date() },
    user_update: { type: String, default: "system", trim: true },

    status: {
      type: String,
      enum: ["Ativo", "Inativo", "Erro"],
      default: "Ativo",
      index: true,
    },
  },
  {
    versionKey: false,
    strict: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: any, ret: any) => {
        if (ret.value && typeof ret.value.toString === "function") {
          ret.value = ret.value.toString(); // "123.45"
        }
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc: any, ret: any) => {
        if (ret.value && typeof ret.value.toString === "function") {
          ret.value = ret.value.toString();
        }
        return ret;
      },
    },
  }
);

PedidoSchema.index(
  { user_id: 1, order_id: 1, product_id: 1, date: 1 },
  { unique: true }
);
PedidoSchema.index({ order_id: 1, date: 1 });
PedidoSchema.index({ date: -1 });

PedidoSchema.pre("save", function (next) {
  this.set("date_update", new Date());
  next();
});

PedidoSchema.pre("findOneAndUpdate", function (next) {
  this.set({ date_update: new Date() });
  next();
});

export function toMoney(value: number | string): Types.Decimal128 {
  const asStr = typeof value === "number" ? value.toFixed(2) : value;
  return mongoose.Types.Decimal128.fromString(asStr);
}

export const PedidoModel: Model<IPedido> =
  mongoose.models.Pedido || mongoose.model<IPedido>("Pedido", PedidoSchema);
