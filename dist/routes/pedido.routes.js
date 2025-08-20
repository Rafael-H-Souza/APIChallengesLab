"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoRoutes = void 0;
const express_1 = require("express");
const pedido_controller_1 = require("../controllers/pedido.controller");
const middleware_logging_1 = require("../middlewares/middleware.logging");
class PedidoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new pedido_controller_1.PedidoController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(middleware_logging_1.requestLogger);
        this.router.get("/periodo", async (req, res, next) => {
            try {
                console.log("[router] datas recebidas:", req.query);
                await this.controller.getByPeriodo(req, res);
            }
            catch (err) {
                console.log("[router] datas recebidas:erro");
                next(err);
            }
        });
    }
    static getRouter() {
        return new this().router;
    }
}
exports.PedidoRoutes = PedidoRoutes;
