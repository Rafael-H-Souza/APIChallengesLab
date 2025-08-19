import dotenv from "dotenv";
import mongoose from "mongoose";
import { App } from "./app";
import connectDB from "./config/database";

dotenv.config();

const PORT = process.env.PORT || 3000;
const myApp = new App();

connectDB();

myApp.app.get("/", (req, res) => {
  res.send("API Logística rodando!");
});

myApp.app.get("/health", async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? "MongoDB conectado" : "MongoDB não conectado";

  res.json({
    server: "API Logística rodando",
    database: dbStatus
  });
});


myApp.app.listen(PORT, () => {
  myApp.start()
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});
