import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "../Service/auth.service.js";
import { LoginSchema } from "../dto/AuthDTO.js";
import dotenv from "dotenv";
dotenv.config();


export interface UsuarioTokenPayload {
  id: number;
  empresaId: number;
  nomeCompleto: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UsuarioTokenPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;

export class AutheController {
  private authService = new AuthService();

  login = async (req: Request, res: Response) => {
    const parsed = LoginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        mensagem: "Dados de login inválidos",
        problema: parsed.error.issues.map((issue) => issue.message),
      });
    }
 
    try {
      const token = await this.authService.login(parsed.data);
     
      return res.status(200).json({
        mensagem: "Autenticação realizada com sucesso",
        token,
      });
    } catch (error: any) {
      return res.status(401).json({
        mensagem: "Falha na autenticação",
        problema: error.message,
      });
    }
  };

  authentication = (req: Request, res: Response, next: NextFunction) => {
    const tokenAuthe = req.headers["authorization"];

    if (!tokenAuthe || typeof tokenAuthe !== "string") {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    const token = tokenAuthe.startsWith("Bearer ")
      ? tokenAuthe.slice(7)
      : tokenAuthe;

    try {
      const decoded = jwt.verify(
        token,
        JWT_SECRET as string
      ) as UsuarioTokenPayload;

      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({ mensagem: "Token inválido ou expirado" });
    }
  };
}
