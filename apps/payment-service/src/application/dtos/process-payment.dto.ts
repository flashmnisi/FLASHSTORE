// apps/payment-service/src/application/dtos/process-payment.dto.ts

import { z } from 'zod';
import validators from '../../utils/validators';

/**
 * Process Payment DTO Schema
 */
export const processPaymentSchema = z.object({
  orderId: validators.orderId,
  userId: validators.userId,

  amount: validators.positiveAmount,
  currency: validators.currency,

  paymentMethod: z
    .enum(['card', 'wallet', 'bank_transfer'])
    .default('card'),

  // Metadata is optional and defaults to empty object
  metadata: z
    .record(z.string(), z.unknown())
    .optional()
    .default({}),
});

export type ProcessPaymentDto = z.infer<typeof processPaymentSchema>;