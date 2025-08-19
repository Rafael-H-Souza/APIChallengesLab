import { Schema, model, Document } from "mongoose";
import { IUser } from "../interfaces/IUser";

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    userID: { type: Number, required: false, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = model<IUserDocument>("User", userSchema);
export default User;
