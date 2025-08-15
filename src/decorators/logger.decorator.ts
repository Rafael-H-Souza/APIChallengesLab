
import { LoggerService } from "../services/logger.service";

export function Logger() {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): void {  // ← retorna void
    const originalMethod = descriptor.value;
    const logger = LoggerService.getInstance();

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);
        await logger.logSuccess(
          target.constructor.name,
          propertyKey.toString(),
          args,
          result
        );
        return result;
      } catch (error) {
        await logger.logError(
          target.constructor.name,
          propertyKey.toString(),
          args,
          error
        );
        throw error;
      }
    };
  };
}
