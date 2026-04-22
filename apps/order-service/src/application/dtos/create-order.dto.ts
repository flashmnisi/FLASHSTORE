import { z } from 'zod';

/**
 * Single item in an order
 */
const orderItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

/**
 * Create Order DTO
 */
export const createOrderSchema = z.object({
  userId: z.string().min(1),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least 1 item'),

  totalAmount: z.number().positive(),

  currency: z.enum(['ZAR', 'USD', 'EUR', 'GBP']).default('ZAR'),

  /**
   * Used for idempotency (VERY IMPORTANT in microservices)
   */
  idempotencyKey: z.string().min(1),

  metadata: z.record(z.any()).optional().default({}),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;