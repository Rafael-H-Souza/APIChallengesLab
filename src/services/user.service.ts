import bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/IUser"; 
import {UserRepository} from "../repositories/user.repository";
import dotenv from "dotenv";

dotenv.config();


const secretKey = process.env.SECRET_KEY as string;


export class UserService {
  userRepository = new UserRepository()


  public async register(username: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.createUser({username, password: hashedPassword });
    return user;
  }


  public async getUsers(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }


  public async getUser(username: string): Promise<IUser> {
    const user = await this.userRepository.findByUserName(username);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }


  public async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findByUserName(username);

    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("User or password is not valid");
    }

    const token = jwt.sign({ id: user.id }, secretKey , { expiresIn: "1h" });
    return token;
  }

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
    await this.userRepository.updatePassword(user.userID, hashedNewPassword);
  }
}

export default new UserService();
