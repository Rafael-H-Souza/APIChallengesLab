"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogModel = void 0;
const mongoose_1 = require("mongoose");
const LogSchema = new mongoose_1.Schema({
    timestamp: { type: Date, default: Date.now },
    className: String,
    methodName: String,
    args: [mongoose_1.Schema.Types.Mixed],
    result: mongoose_1.Schema.Types.Mixed,
    error: String
});
exports.LogModel = (0, mongoose_1.model)("Log", LogSchema);
