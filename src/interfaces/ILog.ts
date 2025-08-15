import {Document } from "mongoose"

export interface ILog extends Document {
  timestamp: Date;
  className: string;
  methodName: string;
  args: any[];
  result?: any;
  error?: string;
}
