import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;