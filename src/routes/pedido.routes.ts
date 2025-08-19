import { Route } from "./Route";
import { PedidoController } from "../controllers/pedido.controller";
import { Request, Response, NextFunction } from "express";

export class PedidoRoutes extends Route {
  private controller: PedidoController;

  constructor() {
    super();
    this.controller = new PedidoController();
  }

  protected initializeRoutes(): void {
    this.get("/", this.wrap(this.controller.getAll));
    this.get("/:id", this.wrap(this.controller.getById));
    this.post("/", this.wrap(this.controller.create));
    this.put("/:id", this.wrap(this.controller.update));
    this.delete("/:id", this.wrap(this.controller.delete));
  }

  private wrap(handler: Function) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler.call(this.controller, req, res, next);
      } catch (error) {
        console.error("Erro na rota:", error);
        res.status(500).json({ message: "Erro interno no servidor" });
      }
    };
  }

  public static getRouter(): import("express").Router {
    return new this().router;
  }
}
