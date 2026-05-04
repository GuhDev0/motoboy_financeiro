import type { Request, Response } from "express";
import { ExpenseService } from "../Service/expense.service.js";
import { CreateExpenseSchema, UpdateExpenseSchema } from "../dto/ExpenseDTO.js";

export class ExpenseController {
  private expenseService = new ExpenseService();

  createExpense = async (req: Request, res: Response) => {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      return res.status(401).json({ mensagem: "Usuário não autenticado" });
    }

    const parsed = CreateExpenseSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        mensagem: "Dados de despesa inválidos",
        problema: parsed.error.issues.map((issue) => issue.message),
      });
    }

    try {
      await this.expenseService.createExpense(authenticatedUser.id, parsed.data);
      return res.status(201).json({ mensagem: "Despesa criada com sucesso" });
    } catch (error: any) {
      return res.status(500).json({
        mensagem: "Erro ao criar despesa",
        problema: error.message,
      });
    }
  };

  getAllExpenses = async (req: Request, res: Response) => {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      return res.status(401).json({ mensagem: "Usuário não autenticado" });
    }

    try {
      await this.expenseService.getAllExpenses(authenticatedUser.id);
      return res.status(200).json({ mensagem: "Busca de despesas concluída" });
    } catch (error: any) {
      return res.status(500).json({
        mensagem: "Erro ao buscar despesas",
        problema: error.message,
      });
    }
  };

  getExpenseById = async (req: Request, res: Response) => {
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
      const expense = await this.expenseService.getExpenseById(authenticatedUser.id, id);

      if (!expense) {
        return res.status(404).json({ mensagem: "Despesa não encontrada" });
      }

      return res.status(200).json({ mensagem: "Despesa encontrada" });
    } catch (error: any) {
      return res.status(500).json({
        mensagem: "Erro ao buscar despesa",
        problema: error.message,
      });
    }
  };

  updateExpense = async (req: Request, res: Response) => {
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

    const parsed = UpdateExpenseSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        mensagem: "Dados de despesa inválidos",
        problema: parsed.error.issues.map((issue) => issue.message),
      });
    }

    try {
      await this.expenseService.updateExpense(authenticatedUser.id, id, parsed.data);
      return res.status(200).json({ mensagem: "Despesa atualizada com sucesso" });
    } catch (error: any) {
      return res.status(400).json({
        mensagem: "Erro ao atualizar despesa",
        problema: error.message,
      });
    }
  };

  deleteExpense = async (req: Request, res: Response) => {
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
      await this.expenseService.deleteExpense(authenticatedUser.id, id);
      return res.status(200).json({ mensagem: "Despesa deletada com sucesso" });
    } catch (error: any) {
      return res.status(400).json({
        mensagem: "Erro ao deletar despesa",
        problema: error.message,
      });
    }
  };
}
