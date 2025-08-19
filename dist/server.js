"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const database_1 = __importDefault(require("./config/database"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const myApp = new app_1.App();
(0, database_1.default)();
myApp.app.get("/", (req, res) => {
    res.send("API Logística rodando!");
});
myApp.app.get("/health", async (req, res) => {
    const dbState = mongoose_1.default.connection.readyState;
    const dbStatus = dbState === 1 ? "MongoDB conectado" : "MongoDB não conectado";
    res.json({
        server: "API Logística rodando",
        database: dbStatus
    });
});
myApp.app.listen(PORT, () => {
    myApp.start();
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});
