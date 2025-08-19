import { PedidoController } from "../../src/controllers/pedido.controller";
import { PedidoService } from "../../src/services/pedido.service";
import  app  from "../../src/app"; 
import { Request, Response } from "express";

describe("PedidoController - Unit", () => {
  let pedidoController: PedidoController;
  let mockService: Partial<PedidoService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockService = {
      getAll: jest.fn().mockResolvedValue([{ id: "123", dataCompra: "2025-08-10" }]),
      create: jest.fn().mockResolvedValue({ id: "123" }),
    };

    pedidoController = new PedidoController(mockService as PedidoService);

    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  it("Deve retornar todos os pedidos sem filtro", async () => {
    await pedidoController.getAll(mockReq as Request, mockRes as Response);

    expect(mockService.getAll).toHaveBeenCalledWith({});
    expect(mockRes.json).toHaveBeenCalledWith([{ id: "123", dataCompra: "2025-08-10" }]);
  });

  it("Deve filtrar pedido por ID", async () => {
    mockReq.query = { id: "123" };
    await pedidoController.getAll(mockReq as Request, mockRes as Response);

    expect(mockService.getAll).toHaveBeenCalledWith({ id: "123" });
  });

  it("Deve filtrar pedidos por intervalo de datas", async () => {
    mockReq.query = { dataInicio: "2025-08-01", dataFim: "2025-08-15" };
    await pedidoController.getAll(mockReq as Request, mockRes as Response);

    expect(mockService.getAll).toHaveBeenCalledWith({
      dataCompra: { $gte: "2025-08-01", $lte: "2025-08-15" }
    });
  });
});
