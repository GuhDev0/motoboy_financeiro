import { z } from "zod";

export const CreateExpenseSchema = z.object({
  description: z.string().nullable().optional(),
  value: z.coerce.number().positive(),
  date: z.coerce.date(),
  category: z.enum(["GASOLINA", "MANUTENCAO", "ALIMENTACAO", "OUTROS"]),
});

export const UpdateExpenseSchema = CreateExpenseSchema.partial();

export type CreateExpenseDTO = z.infer<typeof CreateExpenseSchema>;
export type UpdateExpenseDTO = z.infer<typeof UpdateExpenseSchema>;
