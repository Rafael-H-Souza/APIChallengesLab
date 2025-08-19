import { UserController } from "../../src/controllers/user.controller";
import { UserService } from "../../src/services/user.service";
import { Request, Response } from "express";

describe("UserController - Unit", () => {
  let userController: UserController;
  let mockService: Partial<UserService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockService = {
      create: jest.fn().mockResolvedValue({ id: "1", name: "Rafael", email: "rafael@email.com" }),
      getAll: jest.fn().mockResolvedValue([{ id: "1", name: "Rafael" }]),
    };

    userController = new UserController(mockService as UserService);

    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("Deve criar um usuário", async () => {
    mockReq.body = { name: "Rafael", email: "rafael@email.com" };

    await userController.create(mockReq as Request, mockRes as Response);

    expect(mockService.create).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  it("Deve retornar lista de usuários", async () => {
    await userController.getAll(mockReq as Request, mockRes as Response);

    expect(mockService.getAll).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith([{ id: "1", name: "Rafael" }]);
  });
});
