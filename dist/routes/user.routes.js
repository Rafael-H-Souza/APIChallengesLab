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
        this.router.post("/register", this.userController.register.bind(this.userController));
        this.router.post("/login", this.userController.login.bind(this.userController));
        this.router.put("/updatePassword", auth_middeware_1.authenticateToken, this.userController.updatePassword.bind(this.userController));
        this.router.get("/user", auth_middeware_1.authenticateToken, this.userController.getUsers.bind(this.userController));
    }
    static getRouter() {
        return new UserRouter().router;
    }
}
exports.UserRouter = UserRouter;
