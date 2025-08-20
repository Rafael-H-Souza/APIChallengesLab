
import { Router } from "express";
import { PedidoController } from "../controllers/pedido.controller";
import { Request, Response, NextFunction } from "express";
import { requestLogger } from "../middlewares/middleware.logging";
import { validateParams, validateBody, objectIdParam, pedidoCreateSchema, pedidoUpdateSchema } from "../middlewares/middleware.validate";

import { PeriodoQuerySchema } from "../validations/pedido.validation.schemas";

export class PedidoRoutes{
  
  public router: Router;
  private controller: PedidoController;

  constructor() {    
    
    this.router = Router();
    this.controller = new PedidoController();
    this.initializeRoutes()
  }

  protected initializeRoutes(): void {
    //this.router.use(requestLogger);

    this.router.get("/periodo", async (req, res) => {
      const parsed = PeriodoQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Parâmetros inválidos",
          issues: parsed.error.issues.map(i => ({ path: i.path, message: i.message })),
        });
      }

      try {
        const result = await this.controller.getByPeriodo(parsed.data);
        return res.json(result);
      } catch (err: any) {
        const status = err?.statusCode ?? 500;
        return res.status(status).json({ message: err?.message ?? "Erro interno" });
      }
    });

  
   this.router.get("/:id", (req, res, next) => {
      this.controller.getById(req, res).catch(next);
    });

    
  }

  

  public static getRouter(): import("express").Router {
    return new this().router;
  }
}