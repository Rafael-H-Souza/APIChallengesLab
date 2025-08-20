"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY;
class UserService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async register(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userRepository.createUser({ username, password: hashedPassword });
        return user;
    }
    async getUsers() {
        return this.userRepository.findAll();
    }
    async getUser(username) {
        const user = await this.userRepository.findByUserName(username);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    async login(username, password) {
        const user = await this.userRepository.findByUserName(username);
        if (!user) {
            throw new Error("User not found");
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error("User or password is not valid");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
        return token;
    }
    async updatePassword(username, oldPassword, newPassword, confirmNewPassword) {
        if (!newPassword || newPassword !== confirmNewPassword) {
            throw new Error("Nova senha e a confirmação não são compatíveis");
        }
        const user = await this.getUser(username);
        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            throw new Error("Senha atual inválida");
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepository.updatePassword(user.userID, hashedNewPassword);
    }
}
exports.UserService = UserService;
exports.default = new UserService();
