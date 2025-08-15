import {Schema, model } from "mongoose"
import { ILog } from "../interfaces/ILog";

const LogSchema = new Schema<ILog>({
  timestamp: { type: Date, default: Date.now },
  className: String,
  methodName: String,
  args: [Schema.Types.Mixed],
  result: Schema.Types.Mixed,
  error: String
});

export const LogModel = model<ILog>("Log", LogSchema);