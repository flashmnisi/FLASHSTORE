import { z } from 'zod';
import validators from '../../utils/validators';

export const processPaymentSchema = z.object({
  orderId: validators.orderId,
  userId: validators.userId,
  amount: validators.positiveAmount,
  currency: validators.currency,
  paymentMethod: z.enum(['card']).default('card'),
  metadata: z.record(z.any()).optional().default({}),
});

export type ProcessPaymentDto = z.infer<typeof processPaymentSchema>;