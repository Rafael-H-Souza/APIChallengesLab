
import { Route } from "./Route";
import { PedidoController } from "../controllers/pedido.controller";
import { Request, Response, NextFunction } from "express";
import { requestLogger } from "../middlewares/middleware.logging";
import { validateParams, validateBody, objectIdParam, pedidoCreateSchema, pedidoUpdateSchema } from "../middlewares/middleware.validate";

import { PeriodoQuerySchema } from "../validations/pedido.validation.schemas";

export class PedidoRoutes extends Route {
  private controller: PedidoController;

  constructor() {
    super();
    this.controller = new PedidoController();
  }

  protected initializeRoutes(): void {
    this.router.use(requestLogger);

    this.router.get("/periodo", async (req: Request, res: Response) => {
      console.log("teste")
      const parsed = PeriodoQuerySchema.safeParse(req.query+"&page=1&limit=20&order=desc");
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

   this.get("/lista", async (req: Request, res: Response, next: NextFunction): Promise<void> => {     
    try{
      
        await this.wrap(this.controller.getAll)
      } catch (error) {
        next(error); 
      }
   });

   
  
    this.get("/:id", validateParams(objectIdParam), this.wrap(this.controller.getById));

    
    this.post("/", validateBody(pedidoCreateSchema), this.wrap(this.controller.create));

   
    this.put("/:id",
      validateParams(objectIdParam),
      validateBody(pedidoUpdateSchema),
      this.wrap(this.controller.update)
    );


    this.delete("/:id",
      validateParams(objectIdParam),
      this.wrap(this.controller.delete)
    );
  }

  private wrap(handler: Function) {
    return async (req: Request, res: Response, _next: NextFunction) => {
      try {
        await handler.call(this.controller, req, res);
      } catch (error: any) {
        console.error("Erro na rota", {
          reqId: (req as any).reqId,
          method: req.method,
          url: req.originalUrl,
          error: error?.message,
          stack: error?.stack,
        });
        res.status(500).json({ message: "Erro interno no servidor", reqId: (req as any).reqId });
      }
    };
  }

  public static getRouter(): import("express").Router {
    return new this().router;
  }
}