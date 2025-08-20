"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPedidos = exports.parseLinesToPedidos = void 0;
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
    .map((line, index) => {
    const user_id = toInt(line.slice(0, 10));
    const name = line.slice(11, 55).trim();
    const order_id = toInt(line.slice(55, 65));
    const product_id = toInt(line.slice(65, 75));
    const value = toDecimal128(line.slice(77, 87));
    const date = parseDateYYYYMMDD(line.slice(87, 96));
    // 🔒 Validações
    if (!Number.isFinite(user_id)) {
        throw new Error(`Linha ${index + 1}: user_id inválido`);
    }
    if (!name) {
        throw new Error(`Linha ${index + 1}: nome não pode ser vazio`);
    }
    if (!Number.isFinite(order_id)) {
        throw new Error(`Linha ${index + 1}: order_id inválido, deve ser número`);
    }
    if (!Number.isFinite(product_id)) {
        throw new Error(`Linha ${index + 1}: product_id inválido, deve ser número`);
    }
    if (!(value instanceof mongoose_1.Types.Decimal128)) {
        throw new Error(`Linha ${index + 1}: valor inválido`);
    }
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error(`Linha ${index + 1}: data inválida`);
    }
    return {
        user_id,
        name,
        order_id,
        product_id,
        value,
        date,
    };
});
exports.parseLinesToPedidos = parseLinesToPedidos;
// export const parseLinesToPedidos = (lines: string[]): Partial<IPedido>[] =>
//   lines
//     .map((line) => {
//       const user_id = toInt(line.slice(0, 10));
//       const name = line.slice(11, 55).trim();
//       const order_id = toInt(line.slice(55, 65));
//       const product_id = toInt(line.slice(65, 75));
//       const value = toDecimal128(line.slice(77, 87));
//       const date = parseDateYYYYMMDD(line.slice(87, 96));
//       return {
//         user_id,
//         name,
//         order_id,
//         product_id,
//         value: value ?? undefined,
//         date,
//       } as Partial<IPedido>;
//     })
//     .filter(
//       (p) =>
//         Number.isFinite(p.user_id as number) &&
//         p.name &&
//         Number.isFinite(p.order_id as number) &&
//         Number.isFinite(p.product_id as number) &&
//         p.value instanceof Types.Decimal128 &&
//         p.date instanceof Date
//     );
const transformPedidos = (rawDocs) => {
    const usersMap = new Map();
    for (const doc of rawDocs) {
        const userId = doc.user_id;
        const orderId = doc.order_id;
        const date = new Date(doc.date).toISOString().slice(0, 10); // YYYY-MM-DD
        const value = doc.value?.$numberDecimal ??
            doc.value?.toString?.() ??
            `${doc.value}`;
        if (!usersMap.has(userId)) {
            usersMap.set(userId, {
                user_id: userId,
                name: doc.name,
                orders: [],
            });
        }
        const user = usersMap.get(userId);
        // Procura se já existe esse pedido na lista de orders
        let order = user.orders.find((o) => o.order_id === orderId && o.date === date);
        if (!order) {
            order = {
                order_id: orderId,
                date,
                products: [],
                total: "0.00",
            };
            user.orders.push(order);
        }
        // adiciona produto
        order.products.push({
            product_id: doc.product_id,
            value,
        });
        // soma total
        const oldTotal = parseFloat(order.total);
        order.total = (oldTotal + parseFloat(value)).toFixed(2);
    }
    // log só para debug
    console.log("Docs encontrados:", rawDocs.length, rawDocs.map((d) => d.date));
    return Array.from(usersMap.values());
};
exports.transformPedidos = transformPedidos;
