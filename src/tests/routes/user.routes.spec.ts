import express from "express";
import request from "supertest";

import { UserRouter } from "../../../src/routes/user.routes";
import { UserController } from "../../../src/controllers/user.controller";

jest.mock("../../src/middlewares/auth.middleware", () => ({
  authenticateToken: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));

describe("UserRouter", () => {
  const makeApp = () => {
    const app = express();
    app.use(express.json());
    app.use("/user", UserRouter.getRouter());

    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
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
      .spyOn(UserController.prototype, "register")
      .mockImplementation(async (req: any, res: any) => res.status(201).json({ id: "u1", email: req.body.email }));

    const app = makeApp();

    const res = await request(app)
      .post("/user/register")
      .send({ name: "Rafael", email: "rafael@test.com", password: "123456" });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: "u1", email: "rafael@test.com" });
  });

  it("POST /user/login -> 200 (mock)", async () => {
    const spy = jest
      .spyOn(UserController.prototype, "login")
      .mockImplementation(async (_req: any, res: any) => res.status(200).json({ token: "fake.jwt.token" }));

    const app = makeApp();

    const res = await request(app).post("/user/login").send({ email: "rafael@test.com", password: "123456" });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: "fake.jwt.token" });
  });

  it("GET /user/lista (com auth mock) -> 200 (mock)", async () => {
    const spy = jest
      .spyOn(UserController.prototype, "getUsers")
      .mockImplementation(async (_req: any, res: any) => res.status(200).json([{ id: "u1" }, { id: "u2" }]));

    const app = makeApp();

    const res = await request(app).get("/user/lista");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("propaga erro do controller -> 500", async () => {
    jest
      .spyOn(UserController.prototype, "register")
      .mockImplementation(async () => { throw new Error("fail-register"); });

    const app = makeApp();

    const res = await request(app).post("/user/register").send({ email: "x@y.com", password: "123" });
    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ message: "fail-register" });
  });
});
