import { Router } from "express";
import { PedidoController } from "../controllers/pedido.controller";

export class PedidoRoutes {
  public router: Router;
  private controller: PedidoController;

  constructor() {
    this.router = Router();
    this.controller = new PedidoController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.controller.create);
    this.router.get("/", this.controller.getAll);
    this.router.get("/:id", this.controller.getById);
    this.router.put("/:id", this.controller.update);
    this.router.delete("/:id", this.controller.delete);
  }
}
