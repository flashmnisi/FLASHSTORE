import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  count: z.number().int().min(1),
});

export const updateCartItemSchema = z.object({
  productId: z.string().min(1),
  count: z.number().int().min(0),
});

export type AddToCartDto = z.infer<typeof addToCartSchema>;
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;