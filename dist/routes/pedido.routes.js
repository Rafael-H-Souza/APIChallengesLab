"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoRoutes = void 0;
const express_1 = require("express");
const pedido_controller_1 = require("../controllers/pedido.controller");
const pedido_validation_schemas_1 = require("../validations/pedido.validation.schemas");
class PedidoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new pedido_controller_1.PedidoController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //this.router.use(requestLogger);
        this.router.get("/periodo", async (req, res) => {
            const parsed = pedido_validation_schemas_1.PeriodoQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                return res.status(400).json({
                    message: "Parâmetros inválidos",
                    issues: parsed.error.issues.map(i => ({ path: i.path, message: i.message })),
                });
            }
            try {
                const result = await this.controller.getByPeriodo(parsed.data);
                return res.json(result);
            }
            catch (err) {
                const status = err?.statusCode ?? 500;
                return res.status(status).json({ message: err?.message ?? "Erro interno" });
            }
        });
        this.router.get("/pedidos?limit=50", async (req, res, next) => {
            try {
                await this.controller.getAll(req, res);
            }
            catch (error) {
                next(error);
            }
        });
        this.router.get("/:id", async (req, res, next) => {
            try {
                const pedido = await this.controller.getById(req, res);
                console.log("teste", pedido);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getRouter() {
        return new this().router;
    }
}
exports.PedidoRoutes = PedidoRoutes;
