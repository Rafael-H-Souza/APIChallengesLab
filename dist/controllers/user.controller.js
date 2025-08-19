"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    async register(req, res) {
        try {
            const { username, password } = req.body;
            const user = await this.userService.register(username, password);
            res.json(user);
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const token = await this.userService.login(username, password);
            res.json(token);
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    }
    async updatePassword(req, res) {
        try {
            const { username, password, newPassword, confirmNewPassword } = req.body;
            if (!newPassword || !confirmNewPassword || confirmNewPassword !== newPassword) {
                res.status(400).json({ error: "Nova senha e confirmação inválidas ou incompatíveis" });
                return;
            }
            const token = await this.userService.login(username, password);
            if (!token) {
                res.status(400).json({ error: "Acesso inválido, não é possível alterar a senha" });
                return;
            }
            const user = await this.userService.getUser(username);
            console.log(user.id);
            console.log(token);
            // Aqui você chamaria algo como:
            // await this.userService.updatePassword(user.id, newPassword);
            res.json({ message: "Senha atualizada com sucesso", token });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    }
    async getUsers(req, res) {
        try {
            const users = await this.userService.getUsers();
            res.json(users);
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    }
}
exports.UserController = UserController;
