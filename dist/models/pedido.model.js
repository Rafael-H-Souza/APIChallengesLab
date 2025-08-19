"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoModel = void 0;
const mongoose_1 = require("mongoose");
const PedidoSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.PedidoModel = (0, mongoose_1.model)("Pedido", PedidoSchema);
