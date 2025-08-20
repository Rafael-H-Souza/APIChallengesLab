import { z } from "zod";
// YYYY-MM-DD 
export const DateISO = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato YYYY-MM-DD");

export const PeriodoQuerySchema = z.object({
  dataInicio: DateISO,
  dataFim: DateISO,
  page: z.coerce.number().int().positive().default(1),     // coerce converte string -> number
  limit: z.coerce.number().int().positive().max(200).default(20),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type PeriodoQuery = z.infer<typeof PeriodoQuerySchema>;