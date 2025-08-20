"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const path_1 = __importDefault(require("path"));
const upload_routes_1 = require("../../../src/routes/upload.routes");
const upload_controller_1 = require("../../../src/controllers/upload.controller");
describe("UploadRoutes - POST /upload/txt", () => {
    const makeApp = () => {
        const app = (0, express_1.default)();
        app.use("/upload", upload_routes_1.UploadRoutes.getRouter());
        app.use((err, _req, res, _next) => {
            const code = err?.status || 500;
            res.status(code).json({ message: err?.message || "Internal Error" });
        });
        return app;
    };
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });
    it("deve aceitar arquivo e responder 201", async () => {
        const spy = jest
            .spyOn(upload_controller_1.UploadController.prototype, "uploadFile")
            .mockImplementation(async (req, res) => {
            expect(req.file).toBeDefined();
            expect(req.file.fieldname).toBe("file");
            return res.status(201).json({ ok: true, filename: req.file.originalname });
        });
        const app = makeApp();
        const fixturePath = path_1.default.join(__dirname, "..", "fixtures", "sample.txt");
        const res = await (0, supertest_1.default)(app)
            .post("/upload/txt")
            .attach("file", fixturePath);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("ok", true);
    });
    it("sem arquivo deve retornar 400 (ou seu status de validação)", async () => {
        jest
            .spyOn(upload_controller_1.UploadController.prototype, "uploadFile")
            .mockImplementation(async (req, res) => {
            if (!req.file) {
                return res.status(400).json({ message: "file is required" });
            }
            return res.status(201).json({ ok: true });
        });
        const app = makeApp();
        const res = await (0, supertest_1.default)(app).post("/upload/txt");
        expect([400, 422]).toContain(res.status);
    });
});
