import { z } from 'zod';

/**
 * Order status lifecycle
 */
export const orderStatusEnum = z.enum([
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]);

export const paymentStatusEnum = z.enum([
  'pending',
  'paid',
  'failed',
  'refunded',
]);

/**
 * Update order status DTO
 */
export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),

  status: orderStatusEnum.optional(),

  paymentStatus: paymentStatusEnum.optional(),

  reason: z.string().optional(),
});

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;