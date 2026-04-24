import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1).max(100).default(1),
});

export type AddToCartDto = z.infer<typeof addToCartSchema>;