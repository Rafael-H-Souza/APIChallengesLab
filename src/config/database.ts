import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const MONGO_URI =  "mongodb://localhost:27017/db_Homologacao";//process.env.MONGO_URI ||


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
