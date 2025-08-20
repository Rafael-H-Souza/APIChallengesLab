import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Types } from "mongoose";

export const objectIdParam = z.object({
  id: z.string().refine((v) => Types.ObjectId.isValid(v), {
    message: "Parâmetro 'id' inválido (ObjectId).",
  }),
});

const decimalRegex = /^-?\d+(\.\d+)?$/;

export const pedidoCreateSchema = z.object({
  user_id: z.number().int().nonnegative(),
  name: z.string().min(1),
  order_id: z.number().int().nonnegative(),
  product_id: z.number().int().nonnegative(),
  value: z.union([z.string(), z.number()]).refine((v) => decimalRegex.test(String(v)), {
    message: "value deve ser decimal. Ex.: '123.45'",
  }),
  date: z
    .union([
      z.date(),
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date deve ser 'YYYY-MM-DD'"),
      z.string().datetime({ offset: false }),
    ])
    .optional(),
});

export const pedidoUpdateSchema = pedidoCreateSchema.partial();

export function validateParams(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (parsed.success) {
      req.params = parsed.data as any;
      return next();
    }
    const issues = parsed.error.issues;
    console.warn("Validation error (params)", { method: req.method, url: req.originalUrl, issues });
    return res.status(400).json({ message: "Parâmetros inválidos", issues });
  };
}

export function validateBody(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (parsed.success) {
      req.body = parsed.data as any;
      return next();
    }
    const issues = parsed.error.issues;
    console.warn("Validation error (body)", { method: req.method, url: req.originalUrl, issues });
    return res.status(400).json({ message: "Corpo inválido", issues });
  };
}
