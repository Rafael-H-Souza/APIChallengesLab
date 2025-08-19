"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const upload_controller_1 = require("../controllers/upload.controller");
const upload = (0, multer_1.default)({ dest: "uploads/" });
class UploadRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new upload_controller_1.UploadController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/txt", upload.single("file"), this.controller.upload);
    }
    static getRouter() {
        return new UploadRoutes().router;
    }
}
exports.UploadRoutes = UploadRoutes;
