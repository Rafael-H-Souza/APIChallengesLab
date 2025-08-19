import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.json";
import bodyParser from "body-parser";

import { PedidoRoutes } from "./routes/pedido.routes";
import { UploadRoutes } from "./routes/upload.routes";
import { UserRouter } from "./routes/user.routes";

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.config();
    this.routes();
    this.start();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private start(): void {
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private middlewares() {
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use("/pedidos", PedidoRoutes.getRouter());
    this.app.use("/uploads", UploadRoutes.getRouter());
    this.app.use("/user", UserRouter.getRouter());
  }
}

export default new App().app;
