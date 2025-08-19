"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const pedido_service_1 = require("../services/pedido.service");
class UploadController {
    constructor() {
        this.service = new pedido_service_1.PedidoService();
        this.upload = async (req, res) => {
            try {
                const filePath = req.file?.path || req.body.filePath;
                if (!filePath)
                    return res.status(400).json({ message: "Arquivo não enviado." });
                const user_register = req.user?.email || "system";
                const result = await this.service.processFile(filePath, { user_register });
                res.status(201).json({ message: "Upload processado e salvo.", ...result });
            }
            catch (e) {
                res.status(500).json({ message: e.message });
            }
        };
    }
}
exports.UploadController = UploadController;
