"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoRoutes = void 0;
const Route_1 = require("./Route");
const pedido_controller_1 = require("../controllers/pedido.controller");
const middleware_logging_1 = require("../middlewares/middleware.logging");
const middleware_validate_1 = require("../middlewares/middleware.validate");
const pedido_validation_schemas_1 = require("../validations/pedido.validation.schemas");
class PedidoRoutes extends Route_1.Route {
    constructor() {
        super();
        this.controller = new pedido_controller_1.PedidoController();
    }
    initializeRoutes() {
        this.router.use(middleware_logging_1.requestLogger);
        this.router.get("/periodo", async (req, res) => {
            console.log("teste");
            const parsed = pedido_validation_schemas_1.PeriodoQuerySchema.safeParse(req.query + "&page=1&limit=20&order=desc");
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
        this.get("/lista", async (req, res, next) => {
            try {
                await this.wrap(this.controller.getAll);
            }
            catch (error) {
                next(error);
            }
        });
        this.get("/:id", (0, middleware_validate_1.validateParams)(middleware_validate_1.objectIdParam), this.wrap(this.controller.getById));
        this.post("/", (0, middleware_validate_1.validateBody)(middleware_validate_1.pedidoCreateSchema), this.wrap(this.controller.create));
        this.put("/:id", (0, middleware_validate_1.validateParams)(middleware_validate_1.objectIdParam), (0, middleware_validate_1.validateBody)(middleware_validate_1.pedidoUpdateSchema), this.wrap(this.controller.update));
        this.delete("/:id", (0, middleware_validate_1.validateParams)(middleware_validate_1.objectIdParam), this.wrap(this.controller.delete));
    }
    wrap(handler) {
        return async (req, res, _next) => {
            try {
                await handler.call(this.controller, req, res);
            }
            catch (error) {
                console.error("Erro na rota", {
                    reqId: req.reqId,
                    method: req.method,
                    url: req.originalUrl,
                    error: error?.message,
                    stack: error?.stack,
                });
                res.status(500).json({ message: "Erro interno no servidor", reqId: req.reqId });
            }
        };
    }
    static getRouter() {
        return new this().router;
    }
}
exports.PedidoRoutes = PedidoRoutes;
