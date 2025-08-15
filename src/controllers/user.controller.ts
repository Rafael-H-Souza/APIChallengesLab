import { Logger } from "../decorators/logger.decorator";

export class UserController {
  
  @Logger()
  async createUser(data: any) {
    if (!data.name) throw new Error("Nome é obrigatório");
    return { id: "123", ...data };
  }

  @Logger()
  async getUser(id: string) {
    if (id === "0") throw new Error("User not found");
    return { id, name: "Rafael Souza" };
  }

}
