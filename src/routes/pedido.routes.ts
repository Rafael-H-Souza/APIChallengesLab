import { Route } from "./Route";
import { PedidoController } from "../controllers/pedido.controller";

export class PedidoRoutes extends Route {
  private controller: PedidoController;

  constructor() {
    super();
    this.controller = new PedidoController();
  }

  protected initializeRoutes(): void {
    this.get("/", this.controller.getAll);
    this.get("/:id", this.controller.getById);
    this.post("/", this.controller.create);
    this.put("/:id", this.controller.update);
    this.delete("/:id", this.controller.delete);
  }
  public static getRouter(): import("express").Router {
    return new this().router;
  }
}
