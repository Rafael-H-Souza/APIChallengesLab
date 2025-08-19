"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const path_1 = __importDefault(require("path"));
const pedido_service_1 = require("../services/pedido.service");
class UploadController {
    constructor() {
        this.uploadFile = async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ message: "Arquivo não enviado" });
                }
                const filePath = path_1.default.join(__dirname, "../../uploads", req.file.filename);
                const grouped = await this.pedidoService.processFile(filePath);
                return res.json({
                    message: "Arquivo processado com sucesso",
                    data: grouped
                });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        };
        this.pedidoService = new pedido_service_1.PedidoService();
    }
}
exports.UploadController = UploadController;
