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
myApp.app.get("/", (_req, res) => {
    res.send("API Logística rodando!");
});
myApp.app.get("/health", async (_req, res) => {
    try {
        const dbState = mongoose_1.default.connection.readyState;
        const dbStatus = dbState === 1 ? "MongoDB conectado" : "MongoDB não conectado";
        res.json({
            server: "API Logística rodando",
            database: dbStatus,
        });
    }
    catch (err) {
        console.error("Erro ao consultar status de saúde:", err);
        res.status(500).json({ error: "Falha ao obter status de saúde" });
    }
});
const startServer = async () => {
    try {
        await (0, database_1.default)();
        myApp.app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Falha ao conectar ao MongoDB:", err.message);
        }
        else {
            console.error("Falha ao conectar ao MongoDB: Erro desconhecido");
        }
        process.exit(1);
    }
};
try {
    startServer();
}
catch (err) {
    console.error("Erro fatal na inicialização:", err);
    process.exit(1);
}
exports.default = myApp;
