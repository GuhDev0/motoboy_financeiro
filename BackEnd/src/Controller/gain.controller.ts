import type { Request, Response } from "express";
import { GainService } from "../Service/gain.service.js";
import { CreateGainSchema, UpdateGainSchema } from "../dto/GainDTO.js";

export class GainController {
  private gainService = new GainService();

  createGain = async (req: Request, res: Response) => {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      return res.status(401).json({ mensagem: "Usuário não autenticado" });
    }

    const parsed = CreateGainSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        mensagem: "Dados de ganho inválidos",
        problema: parsed.error.issues.map((issue) => issue.message),
      });
    }

    try {
      await this.gainService.createGain(authenticatedUser.id, parsed.data);
      return res.status(201).json({ mensagem: "Ganho criado com sucesso" });
    } catch (error: any) {
      return res.status(500).json({
        mensagem: "Erro ao criar ganho",
        problema: error.message,
      });
    }
  };

  getAllGains = async (req: Request, res: Response) => {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      return res.status(401).json({ mensagem: "Usuário não autenticado" });
    }

    try {
      const gains = await this.gainService.getAllGains(authenticatedUser.id);
      return res.status(200).json({ message: "Busca de ganhos concluída",
        Gains : gains
       });
    } catch (error: any) {
      return res.status(500).json({
        mensagem: "Erro ao buscar ganhos",
        problema: error.message,
      });
    }
  };

  getGainById = async (req: Request, res: Response) => {
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
      const gain = await this.gainService.getGainById(authenticatedUser.id, id);

      if (!gain) {
        return res.status(404).json({ mensagem: "Ganho não encontrado" });
      }

      return res.status(200).json({ mensagem: "Ganho encontrado" });
    } catch (error: any) {
      return res.status(500).json({
        mensagem: "Erro ao buscar ganho",
        problema: error.message,
      });
    }
  };

  updateGain = async (req: Request, res: Response) => {
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

    const parsed = UpdateGainSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        mensagem: "Dados de ganho inválidos",
        problema: parsed.error.issues.map((issue) => issue.message),
      });
    }

    try {
      await this.gainService.updateGain(authenticatedUser.id, id, parsed.data);
      return res.status(200).json({ mensagem: "Ganho atualizado com sucesso" });
    } catch (error: any) {
      return res.status(400).json({
        mensagem: "Erro ao atualizar ganho",
        problema: error.message,
      });
    }
  };

  deleteGain = async (req: Request, res: Response) => {
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
      await this.gainService.deleteGain(authenticatedUser.id, id);
      return res.status(200).json({ mensagem: "Ganho deletado com sucesso" });
    } catch (error: any) {
      return res.status(400).json({
        mensagem: "Erro ao deletar ganho",
        problema: error.message,
      });
    }
  };
}
