import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const secretKey = process.env.SECRET_KEY as string;

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}


export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

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
  } catch (error) {
    console.error(" Erro no middleware de autenticação:", error);
    return res.status(500).json({ erro: "Erro interno na autenticação." });
  }
}
``
