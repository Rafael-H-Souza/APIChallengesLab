import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const secretKey = "teste@PI"; // ideal usar process.env.SECRET_KEY


declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload; 
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ erro: "Token ausente." });
  }

  jwt.verify(
    token,
    secretKey,
    (err: jwt.VerifyErrors | null, user: string | JwtPayload | undefined) => {
      if (err || !user) {
        return res
          .status(403)
          .json({ erro: "Token inválido ou malformado." });
      }

      req.user = user; 
      next();
    }
  );
}


// const authenticateToken = require("./middlewares/authenticateToken");

// app.get("/pedidos", authenticateToken, (req, res) => {
//   res.json({ mensagem: "Acesso permitido!", usuario: req.user });
// });
