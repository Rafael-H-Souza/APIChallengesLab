"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const SECRET_KEY = "51_Pinga"; // ideal usar process.env.SECRET_KEY
class UserService {
    // Registrar novo usuário
    async register(username, password) {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await user_repository_1.default.createUser({ username, password: hashedPassword });
        return user;
    }
    // Listar todos os usuários
    async getUsers() {
        return user_repository_1.default.findAll();
    }
    // Obter usuário por username
    async getUser(username) {
        const user = await user_repository_1.default.findByUserName(username);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    // Login do usuário
    async login(username, password) {
        const user = await user_repository_1.default.findByUserName(username);
        if (!user) {
            throw new Error("User not found");
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error("User or password is not valid");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
        return token;
    }
    // Atualizar senha
    async updatePassword(username, oldPassword, newPassword, confirmNewPassword) {
        if (!newPassword || newPassword !== confirmNewPassword) {
            throw new Error("Nova senha e a confirmação não são compatíveis");
        }
        const user = await this.getUser(username);
        const isValidPassword = await bcrypt_1.default.compare(oldPassword, user.password);
        if (!isValidPassword) {
            throw new Error("Senha atual inválida");
        }
        const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10);
        await user_repository_1.default.updatePassword(user.userID, hashedNewPassword);
    }
}
exports.UserService = UserService;
exports.default = new UserService();
