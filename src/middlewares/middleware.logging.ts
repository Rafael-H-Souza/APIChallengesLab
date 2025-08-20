import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

function preview(body: any) {
  try {
    const str = JSON.stringify(body);
    if (str.length > 1000) return str.slice(0, 1000) + `…(${str.length} bytes)`;
    return body;
  } catch { return body; }
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  const reqId = (req.headers["x-request-id"] as string) || crypto.randomUUID();
  (req as any).reqId = reqId;
  res.setHeader("x-request-id", reqId);

  console.info("[REQ]", {
    reqId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    params: req.params,
    query: req.query,
    body: preview(req.body),
  });

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.info("[RES]", {
      reqId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: +durationMs.toFixed(2),
    });
  });

  next();
}