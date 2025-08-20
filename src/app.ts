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
    this.app.use("/pedido", PedidoRoutes.getRouter());
    this.app.use("/pedidos", PedidoRoutes.getRouter());
    this.app.use("/uploads", UploadRoutes.getRouter());
    this.app.use("/user", UserRouter.getRouter());
  }
}
//GET /pedidos/periodo?dataInicio=2025-08-01&dataFim=2025-08-19&page=1&limit=20&order=desc

//http://localhost:3000/pedidos/periodo?dataInicio=2025-08-01&dataFim=2020-08-19

export default new App().app;
