"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
class ErrorMiddleware {
    static handle(err, _req, res, _next) {
        console.error(err.stack);
        res.status(500).json({
            message: "Ocorreu um erro no servidor",
            error: err.message,
        });
    }
}
exports.ErrorMiddleware = ErrorMiddleware;
