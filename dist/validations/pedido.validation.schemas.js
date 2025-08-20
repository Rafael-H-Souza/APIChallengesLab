"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodoQuerySchema = exports.DateISO = void 0;
const zod_1 = require("zod");
// YYYY-MM-DD 
exports.DateISO = zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato YYYY-MM-DD");
exports.PeriodoQuerySchema = zod_1.z.object({
    dataInicio: exports.DateISO,
    dataFim: exports.DateISO,
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(200).default(20),
    order: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
