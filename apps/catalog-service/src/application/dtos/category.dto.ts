// apps/catalog-service/src/application/dtos/category.dto.ts

import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(3)
    .max(100),

  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase with hyphens only (e.g. smart-phones)'
    ),

  description: z
    .string()
    .max(500)
    .optional(),

  parentId: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      'Invalid MongoDB ObjectId'
    )
    .optional(),

  imageUrl: z
    .string()
    .url()
    .optional(),

  isActive: z
    .boolean()
    .default(true),
});

export type CategoryDto =
  z.infer<typeof categorySchema>;