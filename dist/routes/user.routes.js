"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const auth_middeware_1 = require("../middlewares/auth.middeware");
const user_controller_1 = require("../controllers/user.controller");
class UserRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userController = new user_controller_1.UserController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/register", async (req, res, next) => {
            try {
                await this.userController.register.bind(this.userController);
            }
            catch (error) {
                next(error);
            }
        });
        this.router.post("/login", async (req, res, next) => {
            try {
                await this.userController.login.bind(this.userController);
            }
            catch (error) {
                next(error);
            }
        });
        this.router.get("/lista", auth_middeware_1.authenticateToken, async (req, res, next) => {
            try {
                await this.userController.getUsers(req, res);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getRouter() {
        return new UserRouter().router;
    }
}
exports.UserRouter = UserRouter;
