
import { Router } from "express";
import { PedidoController } from "../controllers/pedido.controller";
import { Request, Response, NextFunction } from "express";
import { requestLogger } from "../middlewares/middleware.logging";
import { validateParams, validateBody, objectIdParam, pedidoCreateSchema, pedidoUpdateSchema } from "../middlewares/middleware.validate";


export class PedidoRoutes{
  
  public router: Router;
  private controller: PedidoController;

  constructor() {    
    
    this.router = Router();
    this.controller = new PedidoController();
    this.initializeRoutes()
  }

  private  initializeRoutes(): void {
     this.router.use(requestLogger);
     
   this.router.get("/:id", (req, res, next) => {
      this.controller.getById(req, res).catch(next);
    });

  
  this.router.get("/periodo", async (req, res, next) => {
    try {
      console.log("[router] datas recebidas:", req.query);
      
      await this.controller.getByPeriodo(req, res);
    } catch (err) {
      console.log("[router] datas recebidas:erro");
      next(err); 
    }
  });

  }
  public static getRouter(): import("express").Router {
    return new this().router;
  }
}