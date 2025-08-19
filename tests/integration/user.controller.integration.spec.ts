import request from "supertest";
import { App } from "../../src/app";

const app = new App();


describe("PedidoController - Integration", () => {
  it("Deve retornar todos os pedidos (GET /pedidos)", async () => {
    const res = await request(app).get("/pedidos");
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve retornar um pedido pelo ID (GET /pedidos?idPedido=123)", async () => {
    const res = await request(app).get("/pedidos?idPedido=123");
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("idPedido", "123");
  });

  it("Deve retornar pedidos dentro de um intervalo de datas (GET /pedidos?dataInicio=2025-08-01&dataFim=2025-08-19)", async () => {
    const res = await request(app).get("/pedidos?dataInicio=2025-08-01&dataFim=2025-08-19");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    res.body.forEach((pedido: any) => {
      const dataCompra = new Date(pedido.dataCompra);
      expect(dataCompra >= new Date("2025-08-01")).toBe(true);
      expect(dataCompra <= new Date("2025-08-19")).toBe(true);
    });
  });
});
