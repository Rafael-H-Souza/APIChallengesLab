
import { LogModel } from "../models/logger.model";

export class LoggerService {

  private static instance: LoggerService;

  private constructor() {}

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  async logSuccess(
    className: string,
    methodName: string,
    args: any[],
    result: any
  ) {
    await LogModel.create({
      className,
      methodName,
      args,
      result,
      timestamp: new Date()
    });
  }

  async logError(
    className: string,
    methodName: string,
    args: any[],
    error: any
  ) {
    await LogModel.create({
      className,
      methodName,
      args,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date()
    });
  }
}
