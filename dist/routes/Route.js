"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const express_1 = require("express");
class Route {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    get(path, handler) {
        this.router.get(path, handler);
    }
    post(path, handler) {
        this.router.post(path, handler);
    }
    put(path, handler) {
        this.router.put(path, handler);
    }
    patch(path, handler) {
        this.router.patch(path, handler);
    }
    delete(path, handler) {
        this.router.delete(path, handler);
    }
    static getRouter() {
        const instance = new this();
        instance.initializeRoutes();
        return instance.router;
    }
}
exports.Route = Route;
