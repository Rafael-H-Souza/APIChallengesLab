import request from "supertest";
import { App } from "../../src/app";

const app = new App().getApp();

describe("PedidoController - Integration", () => {
  it("POST /pedidos - deve criar um pedido", async () => {
    const res = await request(app)
      .post("/pedidos")
      .send({ id: "123", dataCompra: "2025-08-10" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", "123");
  });

  it("GET /pedidos - deve listar todos os pedidos", async () => {
    const res = await request(app).get("/pedidos");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /pedidos?id=123 - deve filtrar por ID", async () => {
    const res = await request(app).get("/pedidos?id=123");

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty("id", "123");
  });

  it("GET /pedidos?dataInicio=2025-08-01&dataFim=2025-08-15 - deve filtrar por intervalo de datas", async () => {
    const res = await request(app).get("/pedidos?dataInicio=2025-08-01&dataFim=2025-08-15");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
