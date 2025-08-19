import express from 'express';
import request from 'supertest';
import { describe, it, expect } from "@jest/globals";
import bodyParser from 'body-parser';
import { PedidoRoutes } from '../../src/routes/pedido.routes'; 


function makeApp() {
  const app = express();
  app.use("/pedidos", PedidoRoutes.getRouter()); 
  return app;
}

describe("Pedidos API (E2E)", () => {
  const app = makeApp();

  it("POST /pedidos -> cria pedido", async () => {
    const res = await request(app).post("/pedidos").send({
      user_id: 1,
      name: "Cliente Teste",
      order_id: 1001,
      product_id: 500,
      value: "123.45",
      date: "2024-01-15T00:00:00.000Z"
    });
    expect(res.status).toBe(201);
  });

  it("GET /pedidos -> lista", async () => {
    const res = await request(app).get("/pedidos");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
