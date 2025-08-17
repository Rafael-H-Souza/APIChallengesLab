
import { Router, Request, Response, NextFunction } from "express";

type Handler = (req: Request, res: Response, next: NextFunction) => any;

export abstract class Route {
  protected router: Router;

  constructor() {
    this.router = Router();
  }

  protected abstract initializeRoutes(): void;

  protected get(path: string, handler: Handler) {
    this.router.get(path, handler);
  }
  protected post(path: string, handler: Handler) {
    this.router.post(path, handler);
  }
  protected put(path: string, handler: Handler) {
    this.router.put(path, handler);
  }
  protected patch(path: string, handler: Handler) {
    this.router.patch(path, handler);
  }
  protected delete(path: string, handler: Handler) {
    this.router.delete(path, handler);
  }

  public static getRouter<T extends Route>(this: new () => T): Router {
    const instance = new this();
    instance.initializeRoutes();
    return instance.router;
  }
}
