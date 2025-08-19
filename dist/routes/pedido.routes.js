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
        this.get("/", this.controller.getAll);
        this.get("/:id", this.controller.getById);
        this.post("/", this.controller.create);
        this.put("/:id", this.controller.update);
        this.delete("/:id", this.controller.delete);
    }
    static getRouter() {
        return new this().router;
    }
}
exports.PedidoRoutes = PedidoRoutes;
