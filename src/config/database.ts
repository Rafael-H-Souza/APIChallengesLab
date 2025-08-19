import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const LOCAL_URI =
  process.env.MONGO_URI_LOCAL ||
  "mongodb://root:rootLab@localhost:27017/db_Homologacao?authSource=admin";

const DOCKER_URI =
  process.env.MONGO_URI_DOCKER ||
  "mongodb://root:rootLab@db_lab_logistica:27017/db_Homologacao?authSource=admin";

const uri = process.env.NODE_ENV === "docker" ? DOCKER_URI : LOCAL_URI;

async function connectToDatabase(): Promise<void> {
  try {
    if (!uri) {
      throw new Error("A URL de conexão do MongoDB não foi definida no arquivo .env");
    }

    await mongoose.connect(uri, {
      autoIndex: true,
      maxPoolSize: 10,
    });

    console.log(`Conectado ao MongoDB com sucesso em: ${uri}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro na conexão com o MongoDB:", error.message);
    } else {
      console.error("Erro desconhecido na conexão com o MongoDB:", error);
    }
    process.exit(1);
  }
}

export default connectToDatabase;
