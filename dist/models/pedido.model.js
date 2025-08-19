"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoModel = void 0;
exports.toMoney = toMoney;
const mongoose_1 = __importStar(require("mongoose"));
const PedidoSchema = new mongoose_1.Schema({
    user_id: { type: Number, required: true, index: true, immutable: true },
    name: { type: String, required: true, maxlength: 45, trim: true },
    order_id: { type: Number, required: true, index: true, immutable: true },
    product_id: { type: Number, required: true, index: true, immutable: true },
    value: { type: mongoose_1.Schema.Types.Decimal128, required: true },
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
}, {
    versionKey: false,
    strict: true,
    toJSON: {
        virtuals: true,
        transform: (_doc, ret) => {
            if (ret.value && typeof ret.value.toString === "function") {
                ret.value = ret.value.toString(); // "123.45"
            }
            return ret;
        },
    },
    toObject: {
        virtuals: true,
        transform: (_doc, ret) => {
            if (ret.value && typeof ret.value.toString === "function") {
                ret.value = ret.value.toString();
            }
            return ret;
        },
    },
});
PedidoSchema.index({ user_id: 1, order_id: 1, product_id: 1, date: 1 }, { unique: true });
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
function toMoney(value) {
    const asStr = typeof value === "number" ? value.toFixed(2) : value;
    return mongoose_1.default.Types.Decimal128.fromString(asStr);
}
exports.PedidoModel = mongoose_1.default.models.Pedido || mongoose_1.default.model("Pedido", PedidoSchema);
