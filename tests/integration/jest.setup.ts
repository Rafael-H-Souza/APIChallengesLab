import { beforeAll, afterEach, afterAll } from "@jest/globals";
import mongoose from "mongoose";

const uri =
  process.env.MONGO_URI ||
  "mongodb://root:rootLab@localhost:27017/db_test?authSource=admin";

beforeAll(async () => {
  await mongoose.connect(uri);
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Mongo não conectou para os testes.");
  }
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("DB não disponível após conectar.");
  }
  await db.dropDatabase();
});

afterEach(async () => {
  const db = mongoose.connection.db;
  if (!db) return;
  const collections = await db.collections();
  for (const c of collections) {
    await c.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
