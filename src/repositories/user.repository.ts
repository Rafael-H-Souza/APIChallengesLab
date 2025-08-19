import User from "../models/user.model";
import { IUser } from "../interfaces/IUser";

class UserRepository {
  public async createUser(user: Partial<IUser>): Promise<IUser> {
    
    const lastUser = await User.findOne().sort({ userID: -1 }).exec();
    const nextUserID = lastUser ? lastUser.userID + 1 : 1;

    const createdUser = await User.create({ ...user, userID: nextUserID });
    return createdUser;
  }

  public async findByUserName(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  public async findAll(): Promise<IUser[]> {
    return await User.find();
  }

  public async updatePassword(userID: number, newPassword: string): Promise<void> {
    await User.updateOne({ userID }, { password: newPassword });
  }
}

export default new UserRepository();
