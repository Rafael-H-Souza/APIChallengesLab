
import { Router, Request, Response, NextFunction, RequestHandler } from "express";

type Handler = (req: Request, res: Response, next: NextFunction) => any;

export abstract class Route {
  protected router: Router;

  constructor() {
    this.router = Router();
  }

  protected abstract initializeRoutes(): void;

  
  protected patch(path: string, ...handlers: RequestHandler[]) {
    this.router.get(path, ...handlers);
  }
  protected get(path: string, ...handlers: RequestHandler[]) {
    this.router.get(path, ...handlers);
  }
  protected post(path: string, ...handlers: RequestHandler[]) {
    this.router.post(path, ...handlers);
  }
  protected put(path: string, ...handlers: RequestHandler[]) {
    this.router.put(path, ...handlers);
  }
  protected delete(path: string, ...handlers: RequestHandler[]) {
    this.router.delete(path, ...handlers);
  }
  public static getRouter<T extends Route>(this: new () => T): Router {
    const instance = new this();
    instance.initializeRoutes();
    return instance.router;
  }
}
