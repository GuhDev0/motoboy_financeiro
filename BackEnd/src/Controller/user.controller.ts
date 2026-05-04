import type { Request, Response } from "express";
import { UserService } from "../Service/user.service.js";
import { CreateUserSchema } from "../dto/UserDTO.js";

export class UserController {
  private userService = new UserService();

  createUser = async (req: Request, res: Response) => {
    const parsed = CreateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        mensagem: "Dados de usuário inválidos",
        problema: parsed.error.issues.map((issue) => issue.message),
      });
    }

    try {
      await this.userService.createUser(parsed.data);
      return res.status(201).json({ mensagem: "Usuário criado com sucesso" });
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error.message);
      return res.status(500).json({
        mensagem: "Erro ao criar usuário",
        problema: error.message,
      });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    const authenticatedUser = req.user;
    const id = Number(req.params.id);

    if (!authenticatedUser) {
      return res.status(401).json({ mensagem: "Usuário não autenticado" });
    }

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensagem: "ID inválido",
        problema: "O parâmetro id deve ser um número",
      });
    }

    try {
      await this.userService.deleteUser(authenticatedUser.id, id);
      return res.status(200).json({ mensagem: "Usuário deletado com sucesso" });
    } catch (error: any) {
      return res.status(400).json({
        mensagem: "Erro ao deletar usuário",
        problema: error.message,
      });
    }
  };
}
