"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger/swagger.json"));
const body_parser_1 = __importDefault(require("body-parser"));
const pedido_routes_1 = require("./routes/pedido.routes");
const upload_routes_1 = require("./routes/upload.routes");
const user_routes_1 = require("./routes/user.routes");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
    }
    start() {
        this.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
    }
    routes() {
        this.app.use("/pedidos", pedido_routes_1.PedidoRoutes.getRouter());
        this.app.use("/uploads", upload_routes_1.UploadRoutes.getRouter());
        this.app.use("/user", user_routes_1.UserRouter.getRouter());
    }
}
exports.App = App;
exports.default = new App().app;
