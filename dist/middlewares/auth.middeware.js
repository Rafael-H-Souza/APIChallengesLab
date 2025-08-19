"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = "teste@PI"; // ideal usar process.env.SECRET_KEY
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(403).json({ erro: "Token ausente." });
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, user) => {
        if (err || !user) {
            return res
                .status(403)
                .json({ erro: "Token inválido ou malformado." });
        }
        req.user = user;
        next();
    });
}
// const authenticateToken = require("./middlewares/authenticateToken");
// app.get("/pedidos", authenticateToken, (req, res) => {
//   res.json({ mensagem: "Acesso permitido!", usuario: req.user });
// });
