// import { UserController } from "../../src/controllers/user.controller";


// jest.mock("../../src/services/logger.service.ts", () => {
//   return {
//     LoggerService: {
//       getInstance: () => ({
//         logSuccess: jest.fn(),
//         logError: jest.fn(),
//       }),
//     },
//   };
// });

// describe("UserController Unit Tests", () => {
//   let controller: UserController;

//   beforeEach(() => {
//     controller = new UserController();
//   });

//   it("should return user object when id is valid", async () => {
//     const result = await controller.getUser("1");
//     expect(result).toEqual({ id: "1", name: "Rafael Souza" });
//   });

//   it("should throw error when id is 0", async () => {
//     await expect(controller.getUser("0")).rejects.toThrow("User not found");
//   });
// });
