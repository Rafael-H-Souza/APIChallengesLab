import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/IUser"; 
import userRepository from "../repositories/user.repository";

const SECRET_KEY = "51_Pinga"; // ideal usar process.env.SECRET_KEY

export class UserService {
  public async register(username: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.createUser({username, password: hashedPassword });
    return user;
  }


  public async getUsers(): Promise<IUser[]> {
    return userRepository.findAll();
  }


  public async getUser(username: string): Promise<IUser> {
    const user = await userRepository.findByUserName(username);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }


  public async login(username: string, password: string): Promise<string> {
    const user = await userRepository.findByUserName(username);

    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("User or password is not valid");
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    return token;
  }

  // Atualizar senha
  public async updatePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<void> {
    if (!newPassword || newPassword !== confirmNewPassword) {
      throw new Error("Nova senha e a confirmação não são compatíveis");
    }

    const user = await this.getUser(username);

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error("Senha atual inválida");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(user.userID, hashedNewPassword);
  }
}

export default new UserService();
