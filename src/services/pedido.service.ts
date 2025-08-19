import { PedidoRepository } from "../repositories/pedido.repository";
import { IPedido } from "../interfaces/IPedido";
import fs from "fs";

export class PedidoService {
  private repository: PedidoRepository;

  constructor() {
    this.repository = new PedidoRepository();
  }
  public async processFile(filePath: string) {
    const data = fs.readFileSync(filePath, "utf-8");
    const lines = data.split(/\r?\n/).filter(line => line.trim() !== "");

    const pedidos = lines.map(line => {
      const rawDate = line.slice(87, 96).trim();
      const formattedDate = rawDate.length === 8
        ? `${rawDate.slice(0,4)}-${rawDate.slice(4,6)}-${rawDate.slice(6,8)}`
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

    
    const grouped = pedidos.reduce((acc: any[], curr) => {
      let user = acc.find(u => u.user_id === parseInt(curr.userId, 10));
      if (!user) {
        user = {
          user_id: parseInt(curr.userId, 10),
          name: curr.userName,
          orders: []
        };
        acc.push(user);
      }

      let order = user.orders.find((o: any) => o.order_id === parseInt(curr.orderId, 10));
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


  public async create(pedido: IPedido) {
    return this.repository.create(pedido);
  }

  public async getAll() {
    return this.repository.findAll();
  }

  public async getById(id: string) {
    return this.repository.findById(id);
  }

  public async update(id: string, pedido: Partial<IPedido>) {
    return this.repository.update(id, pedido);
  }

  public async delete(id: string) {
    return this.repository.delete(id);
  }

}


                               