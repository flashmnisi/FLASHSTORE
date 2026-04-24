import { z } from 'zod';

export const removeFromCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

export type RemoveFromCartDto = z.infer<typeof removeFromCartSchema>;