"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const user_routes_1 = require("../../../src/routes/user.routes");
const user_controller_1 = require("../../../src/controllers/user.controller");
jest.mock("../../src/middlewares/auth.middleware", () => ({
    authenticateToken: (_req, _res, next) => next(),
}));
describe("UserRouter", () => {
    const makeApp = () => {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use("/user", user_routes_1.UserRouter.getRouter());
        app.use((err, _req, res, _next) => {
            res.status(500).json({ message: err?.message || "Internal Error" });
        });
        return app;
    };
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });
    it("POST /user/register -> 201 (mock)", async () => {
        const spy = jest
            .spyOn(user_controller_1.UserController.prototype, "register")
            .mockImplementation(async (req, res) => res.status(201).json({ id: "u1", email: req.body.email }));
        const app = makeApp();
        const res = await (0, supertest_1.default)(app)
            .post("/user/register")
            .send({ name: "Rafael", email: "rafael@test.com", password: "123456" });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ id: "u1", email: "rafael@test.com" });
    });
    it("POST /user/login -> 200 (mock)", async () => {
        const spy = jest
            .spyOn(user_controller_1.UserController.prototype, "login")
            .mockImplementation(async (_req, res) => res.status(200).json({ token: "fake.jwt.token" }));
        const app = makeApp();
        const res = await (0, supertest_1.default)(app).post("/user/login").send({ email: "rafael@test.com", password: "123456" });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ token: "fake.jwt.token" });
    });
    it("GET /user/lista (com auth mock) -> 200 (mock)", async () => {
        const spy = jest
            .spyOn(user_controller_1.UserController.prototype, "getUsers")
            .mockImplementation(async (_req, res) => res.status(200).json([{ id: "u1" }, { id: "u2" }]));
        const app = makeApp();
        const res = await (0, supertest_1.default)(app).get("/user/lista");
        expect(spy).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
    });
    it("propaga erro do controller -> 500", async () => {
        jest
            .spyOn(user_controller_1.UserController.prototype, "register")
            .mockImplementation(async () => { throw new Error("fail-register"); });
        const app = makeApp();
        const res = await (0, supertest_1.default)(app).post("/user/register").send({ email: "x@y.com", password: "123" });
        expect(res.status).toBe(500);
        expect(res.body).toMatchObject({ message: "fail-register" });
    });
});
