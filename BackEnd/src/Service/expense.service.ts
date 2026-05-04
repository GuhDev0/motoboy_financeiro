import { ExpenseRepository } from "../Repository/expense.repository.js";
import type { CreateExpenseDTO, UpdateExpenseDTO } from "../dto/ExpenseDTO.js";

export class ExpenseService {
  private expenseRepository = new ExpenseRepository();

  createExpense = async (userId: number, expenseData: CreateExpenseDTO) => {
    return this.expenseRepository.create(userId, expenseData);
  };

  getAllExpenses = async (userId: number) => {
    return this.expenseRepository.findAll(userId);
  };

  getExpenseById = async (userId: number, id: number) => {
    return this.expenseRepository.findById(userId, id);
  };

  updateExpense = async (userId: number, id: number, expenseData: UpdateExpenseDTO) => {
    return this.expenseRepository.update(userId, id, expenseData);
  };

  deleteExpense = async (userId: number, id: number) => {
    return this.expenseRepository.delete(userId, id);
  };
}
