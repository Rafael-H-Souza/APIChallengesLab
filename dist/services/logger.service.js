"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const logger_model_1 = require("../models/logger.model");
class LoggerService {
    constructor() { }
    static getInstance() {
        if (!LoggerService.instance) {
            LoggerService.instance = new LoggerService();
        }
        return LoggerService.instance;
    }
    async logSuccess(className, methodName, args, result) {
        await logger_model_1.LogModel.create({
            className,
            methodName,
            args,
            result,
            timestamp: new Date()
        });
    }
    async logError(className, methodName, args, error) {
        await logger_model_1.LogModel.create({
            className,
            methodName,
            args,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date()
        });
    }
}
exports.LoggerService = LoggerService;
