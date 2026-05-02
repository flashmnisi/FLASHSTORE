// apps/payment-service/src/utils/validators.ts

import { z } from 'zod';

/**
 * Primitive reusable validators
 */
const positiveAmount = z
  .number()
  .positive('Amount must be greater than zero')
  .max(1_000_000, 'Amount too large')
  .refine((val) => Number.isFinite(val), 'Invalid amount')
  .refine((val) => Math.round(val * 100) === val * 100, {
    message: 'Amount must have max 2 decimal places',
  });

const currency = z.enum(['ZAR', 'USD', 'EUR', 'GBP']).default('ZAR');

const orderId = z
  .string()
  .min(1, 'Order ID is required')
  .regex(/^[a-zA-Z0-9-]+$/, 'Invalid order ID format');

const userId = z
  .string()
  .min(1, 'User ID is required')
  .regex(/^[a-zA-Z0-9-]+$/, 'Invalid user ID format');

const stripePaymentIntentId = z
  .string()
  .startsWith('pi_', 'Invalid Stripe Payment Intent ID')
  .min(10, 'Invalid Stripe Payment Intent ID');

/**
 * Composite schemas for DTOs
 */
const processPayment = z.object({
  orderId,
  userId,
  amount: positiveAmount,
  currency,
  paymentMethod: z.enum(['card']).default('card'),
  // FIXED: Correct Zod record syntax → record(keyType, valueType)
  metadata: z.record(z.string(), z.any()).optional().default({}),
});

const webhookEvent = z.object({
  id: z.string(),
  object: z.literal('event'),
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
  created: z.number(),
  livemode: z.boolean(),
});

/**
 * Clean, reusable validator API
 */
export const validators = {
  positiveAmount,
  currency,
  orderId,
  userId,
  stripePaymentIntentId,
  processPayment,
  webhookEvent,
} as const;

/**
 * Express middleware validator
 */
export const validate = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
    }

    req.body = result.data;
    next();
  };
};

/**
 * Type exports
 */
export type ProcessPaymentInput = z.infer<typeof processPayment>;
export type WebhookEventInput = z.infer<typeof webhookEvent>;

export default validators;