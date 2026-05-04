import type { Expense, Prisma } from "@prisma/client";
import type { CreateExpenseDTO, UpdateExpenseDTO } from "../dto/ExpenseDTO.js";
import { prisma } from "../lib/prisma.js";

const removeUndefined = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;

export class ExpenseRepository {
  async create(userId: number, data: CreateExpenseDTO): Promise<Expense> {
    const createData = removeUndefined({
      ...data,
      userId,
      description: data.description ?? null,
    }) as Prisma.ExpenseUncheckedCreateInput;

    return prisma.expense.create({
      data: createData,
    });
  }

  async findAll(userId: number): Promise<Expense[]> {
    return prisma.expense.findMany({
      where: { userId },
    });
  }

  async findById(userId: number, id: number): Promise<Expense | null> {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense || expense.userId !== userId) {
      return null;
    }

    return expense;
  }

  async update(userId: number, id: number, data: UpdateExpenseDTO): Promise<Expense> {
    const expense = await this.findById(userId, id);

    if (!expense) {
      throw new Error("Registro não encontrado ou indisponível");
    }

    const updateData = removeUndefined({
      ...data,
      description: data.description ?? null,
    }) as Prisma.ExpenseUncheckedUpdateInput;

    return prisma.expense.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(userId: number, id: number): Promise<Expense> {
    const expense = await this.findById(userId, id);

    if (!expense) {
      throw new Error("Registro não encontrado ou indisponível");
    }

    return prisma.expense.delete({
      where: { id },
    });
  }
}
