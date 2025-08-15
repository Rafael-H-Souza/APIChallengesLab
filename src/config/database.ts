import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/logs", {
      autoIndex: true
    });
    console.log("MongoDB conectado!");
  } catch (error) {
    console.error("Erro ao conectar MongoDB", error);
    process.exit(1);
  }
}
