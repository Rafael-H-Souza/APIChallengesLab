// tests/integration/pedido.service.spec.ts
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import fs from "fs";
import os from "os";
import path from "path";
import { PedidoService } from "../../src/services/pedido.service";

const uri =
  process.env.MONGO_URI ||
  "mongodb://root:rootLab@localhost:27017/db_test?authSource=admin";

const mkLine = ({
  user_id = "0000000001",
  name = "Cliente Teste".padEnd(44, " "),
  order_id = "0000001001",
  product_id = "0000000500",
  value = "00000123.45",
  date = "20240115"
} = {}) =>
  [
    user_id,     // 0-9
    " ",         // 10
    name,        // 11-54
    order_id,    // 55-64
    product_id,  // 65-74
    " ",         // 75
    value,       // 77-86
    date         // 87-94
  ].join("");

describe("PedidoService.processFile (integration)", () => {
  const service = new PedidoService(); // ✅ só o service

  beforeAll(async () => {
    await mongoose.connect(uri);
    if (!mongoose.connection.db) throw new Error("DB indisponível");
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("processa e insere linhas válidas", async () => {
    const tmp = path.join(os.tmpdir(), `pedidos-${Date.now()}.txt`);
    const lines = [
      mkLine(),
      mkLine({
        order_id: "0000001002",
        product_id: "0000000501",
        value: "00000010.00",
        date: "20240210"
      })
    ];
    fs.writeFileSync(tmp, lines.join("\n"), "utf-8");

    const result = await service.processFile(tmp, { user_register: "jest" });

    expect(result.totalLines).toBe(2);
    expect(result.valid).toBe(2);
    expect(result.inserted).toBeGreaterThanOrEqual(2);
  });
});
