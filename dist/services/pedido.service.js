"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoService = void 0;
const pedido_repository_1 = require("../repositories/pedido.repository");
const fs_1 = __importDefault(require("fs"));
class PedidoService {
    constructor() {
        this.repository = new pedido_repository_1.PedidoRepository();
    }
    async processFile(filePath) {
        const data = fs_1.default.readFileSync(filePath, "utf-8");
        const lines = data.split(/\r?\n/).filter(line => line.trim() !== "");
        const pedidos = lines.map(line => {
            const rawDate = line.slice(87, 96).trim();
            const formattedDate = rawDate.length === 8
                ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
                : undefined;
            return {
                userId: line.slice(0, 10).trim(),
                userName: line.slice(11, 55).trim(),
                orderId: line.slice(55, 65).trim(),
                prodId: parseFloat(line.slice(65, 75).trim()),
                value: parseFloat(line.slice(77, 87).trim()),
                date: formattedDate,
            };
        });
        const grouped = pedidos.reduce((acc, curr) => {
            let user = acc.find(u => u.user_id === parseInt(curr.userId, 10));
            if (!user) {
                user = {
                    user_id: parseInt(curr.userId, 10),
                    name: curr.userName,
                    orders: []
                };
                acc.push(user);
            }
            let order = user.orders.find((o) => o.order_id === parseInt(curr.orderId, 10));
            if (!order) {
                order = {
                    order_id: parseInt(curr.orderId, 10),
                    total: "0.00",
                    date: curr.date,
                    products: []
                };
                user.orders.push(order);
            }
            order.products.push({
                product_id: curr.prodId,
                value: curr.value.toFixed(2)
            });
            order.total = (parseFloat(order.total) + curr.value).toFixed(2);
            return acc;
        }, []);
        return grouped;
    }
    async create(pedido) {
        return this.repository.create(pedido);
    }
    async getAll() {
        return this.repository.findAll();
    }
    async getById(id) {
        return this.repository.findById(id);
    }
    async update(id, pedido) {
        return this.repository.update(id, pedido);
    }
    async delete(id) {
        return this.repository.delete(id);
    }
}
exports.PedidoService = PedidoService;
