"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const express_1 = require("express");
class Route {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    patch(path, ...handlers) {
        this.router.get(path, ...handlers);
    }
    get(path, ...handlers) {
        this.router.get(path, ...handlers);
    }
    post(path, ...handlers) {
        this.router.post(path, ...handlers);
    }
    put(path, ...handlers) {
        this.router.put(path, ...handlers);
    }
    delete(path, ...handlers) {
        this.router.delete(path, ...handlers);
    }
    static getRouter() {
        const instance = new this();
        instance.initializeRoutes();
        return instance.router;
    }
}
exports.Route = Route;
