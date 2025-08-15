import "reflect-metadata";
import express from "express";
import { connectDB } from "./config/database";
import { UserController } from "./controllers/user.controller";

const app = express();
app.use(express.json());

const userController = new UserController();

app.get("/user/:id", (req, res) => userController.getUser(req.params.id).then(res.json).catch(err => res.status(500).json({ error: err.message })));
app.post("/user", (req, res) => userController.createUser(req.body).then(res.json).catch(err => res.status(500).json({ error: err.message })));

connectDB();

app.listen(3000, () => console.log("API rodando na porta 3000"));
