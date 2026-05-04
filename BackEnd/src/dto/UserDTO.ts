import { z } from "zod";

export const CreateUserSchema = z.object({
  nameComplete: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
