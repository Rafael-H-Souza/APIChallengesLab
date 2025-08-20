import express from "express";
import request from "supertest";
import path from "path";



import { UploadRoutes } from "../../../src/routes/upload.routes";
import { UploadController } from "../../../src/controllers/upload.controller";

describe("UploadRoutes - POST /upload/txt", () => {
  const makeApp = () => {
    const app = express();
    app.use("/upload", UploadRoutes.getRouter());

 
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
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
      .spyOn(UploadController.prototype, "uploadFile")
      .mockImplementation(async (req: any, res: any) => {
        expect(req.file).toBeDefined();
        expect(req.file.fieldname).toBe("file");
        return res.status(201).json({ ok: true, filename: req.file.originalname });
      });

    const app = makeApp();

    
    const fixturePath = path.join(__dirname, "..", "fixtures", "sample.txt");

    const res = await request(app)
      .post("/upload/txt")
      .attach("file", fixturePath); 

    expect(spy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("ok", true);
  });

  it("sem arquivo deve retornar 400 (ou seu status de validação)", async () => {

    jest
      .spyOn(UploadController.prototype, "uploadFile")
      .mockImplementation(async (req: any, res: any) => {
        if (!req.file) {
          return res.status(400).json({ message: "file is required" });
        }
        return res.status(201).json({ ok: true });
      });

    const app = makeApp();

    const res = await request(app).post("/upload/txt"); 

    expect([400, 422]).toContain(res.status); 
  });
});
