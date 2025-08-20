"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pedidoUpdateSchema = exports.pedidoCreateSchema = exports.objectIdParam = void 0;
exports.validateParams = validateParams;
exports.validateBody = validateBody;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
exports.objectIdParam = zod_1.z.object({
    id: zod_1.z.string().refine((v) => mongoose_1.Types.ObjectId.isValid(v), {
        message: "Parâmetro 'id' inválido (ObjectId).",
    }),
});
const decimalRegex = /^-?\d+(\.\d+)?$/;
exports.pedidoCreateSchema = zod_1.z.object({
    user_id: zod_1.z.number().int().nonnegative(),
    name: zod_1.z.string().min(1),
    order_id: zod_1.z.number().int().nonnegative(),
    product_id: zod_1.z.number().int().nonnegative(),
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).refine((v) => decimalRegex.test(String(v)), {
        message: "value deve ser decimal. Ex.: '123.45'",
    }),
    date: zod_1.z
        .union([
        zod_1.z.date(),
        zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date deve ser 'YYYY-MM-DD'"),
        zod_1.z.string().datetime({ offset: false }),
    ])
        .optional(),
});
exports.pedidoUpdateSchema = exports.pedidoCreateSchema.partial();
function validateParams(schema) {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.params);
        if (parsed.success) {
            req.params = parsed.data;
            return next();
        }
        const issues = parsed.error.issues;
        console.warn("Validation error (params)", { method: req.method, url: req.originalUrl, issues });
        return res.status(400).json({ message: "Parâmetros inválidos", issues });
    };
}
function validateBody(schema) {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.body);
        if (parsed.success) {
            req.body = parsed.data;
            return next();
        }
        const issues = parsed.error.issues;
        console.warn("Validation error (body)", { method: req.method, url: req.originalUrl, issues });
        return res.status(400).json({ message: "Corpo inválido", issues });
    };
}
