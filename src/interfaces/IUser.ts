import {Document } from "mongoose";
export interface IUser extends Document {
  userID: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

