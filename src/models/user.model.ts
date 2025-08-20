import { Schema, model, Document } from "mongoose";
import { IUser } from "../interfaces/IUser";

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
   {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,   
      unique: true,      
      index: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = model<IUserDocument>("User", userSchema);
export default User;
