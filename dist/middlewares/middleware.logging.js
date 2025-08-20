"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const crypto_1 = __importDefault(require("crypto"));
function preview(body) {
    try {
        const str = JSON.stringify(body);
        if (str.length > 1000)
            return str.slice(0, 1000) + `…(${str.length} bytes)`;
        return body;
    }
    catch {
        return body;
    }
}
function requestLogger(req, res, next) {
    const start = process.hrtime.bigint();
    const reqId = req.headers["x-request-id"] || crypto_1.default.randomUUID();
    req.reqId = reqId;
    res.setHeader("x-request-id", reqId);
    console.info("[REQ]", {
        reqId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        params: req.params,
        query: req.query,
        body: preview(req.body),
    });
    res.on("finish", () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
        console.info("[RES]", {
            reqId,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            durationMs: +durationMs.toFixed(2),
        });
    });
    next();
}
