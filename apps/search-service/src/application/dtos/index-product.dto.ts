import { z } from 'zod';

export const indexProductSchema = z.object({
  id: z.string(),

  name: z.string(),
  description: z.string(),

  price: z.number(),
  currency: z.string().default('ZAR'),

  category: z.string(),
  brand: z.string().optional(),

  tags: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),

  inStock: z.boolean().default(true),

  rating: z.number().default(0),
  reviewCount: z.number().default(0),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type IndexProductDto = z.infer<typeof indexProductSchema>;