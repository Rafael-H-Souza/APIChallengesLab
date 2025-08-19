"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = Logger;
const logger_service_1 = require("../services/logger.service");
function Logger() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const logger = logger_service_1.LoggerService.getInstance();
        descriptor.value = async function (...args) {
            try {
                const result = await originalMethod.apply(this, args);
                await logger.logSuccess(target.constructor.name, propertyKey.toString(), args, result);
                return result;
            }
            catch (error) {
                await logger.logError(target.constructor.name, propertyKey.toString(), args, error);
                throw error;
            }
        };
    };
}
