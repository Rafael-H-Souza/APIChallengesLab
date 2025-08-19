"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoRoutes = void 0;
const Route_1 = require("./Route");
const pedido_controller_1 = require("../controllers/pedido.controller");
class PedidoRoutes extends Route_1.Route {
    constructor() {
        super();
        this.controller = new pedido_controller_1.PedidoController();
    }
    initializeRoutes() {
        this.get("/", this.wrap(this.controller.getAll));
        this.get("/:id", this.wrap(this.controller.getById));
        this.post("/", this.wrap(this.controller.create));
        this.put("/:id", this.wrap(this.controller.update));
        this.delete("/:id", this.wrap(this.controller.delete));
    }
    wrap(handler) {
        return async (req, res, next) => {
            try {
                await handler.call(this.controller, req, res, next);
            }
            catch (error) {
                console.error("Erro na rota:", error);
                res.status(500).json({ message: "Erro interno no servidor" });
            }
        };
    }
    static getRouter() {
        return new this().router;
    }
}
exports.PedidoRoutes = PedidoRoutes;
