import express, { Application } from "express";
import mongoose from "mongoose";
import { PedidoRoutes } from "./routes/pedido.routes";
import { ErrorMiddleware } from "./middlewares/error.middleware";

class App {
  public app: Application;
  private pedidoRoutes: PedidoRoutes;

  constructor() {
    this.app = express();
    this.pedidoRoutes = new PedidoRoutes();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.connectDatabase();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeRoutes() {
    this.app.use("/pedidos", this.pedidoRoutes.router);
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware.handle);
  }

  private async connectDatabase() {
    try {
      await mongoose.connect("mongodb://localhost:27017/test");
      console.log("MongoDB conectado 🚀");
    } catch (error) {
      console.error("Erro ao conectar no MongoDB", error);
    }
  }

  public listen() {
    this.app.listen(3000, () => {
      console.log("Servidor rodando em http://localhost:3000");
    });
  }
}

const server = new App();
server.listen();
