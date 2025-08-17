
import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json';
import bodyParser from 'body-parser';

import { PedidoRoutes } from './routes/pedido.routes';
//import {  } from './routes/upload.routes';

export class Server {
  public app: Application;
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private routes(): void {
    this.app.use("/pedidos", PedidoRoutes.getRouter());
    //this.app.use('/uploads', UploadRouter);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port}`);
      console.log(`Swagger disponível em http://localhost:${this.port}/api-docs`);
    });
  }
}

// Inicializar servidor
const server = new Server();
server.start();
