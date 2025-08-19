"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY;
function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
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
    catch (error) {
        console.error(" Erro no middleware de autenticação:", error);
        return res.status(500).json({ erro: "Erro interno na autenticação." });
    }
}
``;
