import { z } from "zod";

export const CreateGainSchema = z.object({
  description: z.string().min(1),
  value: z.coerce.number().positive(),
  date: z.coerce.date(),
  platform: z.string().min(1),
});

export const UpdateGainSchema = CreateGainSchema.partial();

export type CreateGainDTO = z.infer<typeof CreateGainSchema>;
export type UpdateGainDTO = z.infer<typeof UpdateGainSchema>;
