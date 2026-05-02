// apps/catalog-service/src/application/dtos/category.dto.ts

import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  parentId: z.string().optional(),           // MongoDB ID as string
  imageUrl: z.string().url().optional(),
});

export type CategoryDto = z.infer<typeof categorySchema>;