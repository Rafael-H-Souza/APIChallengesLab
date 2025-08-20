import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const user = await this.userService.register(username, password);
      res.json(user);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const token = await this.userService.login(username, password);
      res.json(token);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }

  public async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, newPassword, confirmNewPassword } = req.body;

      if (!newPassword || !confirmNewPassword || confirmNewPassword !== newPassword) {
        res.status(400).json({ error: "Nova senha e confirmação inválidas ou incompatíveis" });
        return;
      }

      const token = await this.userService.login(username, password);
      if (!token) {
        res.status(400).json({ error: "Acesso inválido, não é possível alterar a senha" });
        return;
      }

      const user = await this.userService.getUser(username);
      console.log(user.id);
      console.log(token);

      // Aqui você chamaria algo como:
      // await this.userService.updatePassword(user.id, newPassword);

      res.json({ message: "Senha atualizada com sucesso", token });
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }

  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getUsers();
      res.json(users);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }
  
}
