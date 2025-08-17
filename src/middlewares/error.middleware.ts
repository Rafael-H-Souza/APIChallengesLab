import { Request, Response, NextFunction } from "express";

export class ErrorMiddleware {
  public static handle(err: any, _req: Request, res: Response, _next: NextFunction) {
    console.error(err.stack);
    res.status(500).json({
      message: "Ocorreu um erro no servidor",
      error: err.message,
    });
  }
}
