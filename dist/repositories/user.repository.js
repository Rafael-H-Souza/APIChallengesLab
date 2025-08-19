"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
class UserRepository {
    async createUser(user) {
        const lastUser = await user_model_1.default.findOne().sort({ userID: -1 }).exec();
        const nextUserID = lastUser ? lastUser.userID + 1 : 1;
        const createdUser = await user_model_1.default.create({ ...user, userID: nextUserID });
        return createdUser;
    }
    async findByUserName(username) {
        return await user_model_1.default.findOne({ username });
    }
    async findAll() {
        return await user_model_1.default.find();
    }
    async updatePassword(userID, newPassword) {
        await user_model_1.default.updateOne({ userID }, { password: newPassword });
    }
}
exports.default = new UserRepository();
