"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLinesToPedidos = void 0;
const mongoose_1 = require("mongoose");
const toInt = (s) => {
    const n = parseInt(s.trim(), 10);
    return Number.isFinite(n) ? n : NaN;
};
const toDecimal128 = (s) => {
    const norm = s.trim().replace(",", ".");
    if (!/^-?\d+(\.\d+)?$/.test(norm))
        return null;
    return mongoose_1.Types.Decimal128.fromString(norm);
};
const parseDateYYYYMMDD = (raw) => {
    const v = raw.trim();
    if (v.length !== 8)
        return undefined;
    const y = v.slice(0, 4);
    const m = v.slice(4, 6);
    const d = v.slice(6, 8);
    const iso = `${y}-${m}-${d}T12:00:00.000Z`;
    const dt = new Date(iso);
    return isNaN(dt.getTime()) ? undefined : dt;
};
const parseLinesToPedidos = (lines) => lines
    .map((line) => {
    const user_id = toInt(line.slice(0, 10));
    const name = line.slice(11, 55).trim();
    const order_id = toInt(line.slice(55, 65));
    const product_id = toInt(line.slice(65, 75));
    const value = toDecimal128(line.slice(77, 87));
    const date = parseDateYYYYMMDD(line.slice(87, 96));
    return {
        user_id,
        name,
        order_id,
        product_id,
        value: value ?? undefined,
        date,
    };
})
    .filter((p) => Number.isFinite(p.user_id) &&
    p.name &&
    Number.isFinite(p.order_id) &&
    Number.isFinite(p.product_id) &&
    p.value instanceof mongoose_1.Types.Decimal128 &&
    p.date instanceof Date);
exports.parseLinesToPedidos = parseLinesToPedidos;
