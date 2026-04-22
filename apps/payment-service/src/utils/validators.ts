import { z } from 'zod';

/**
 * Primitive reusable validators
 */
const positiveAmount = z
  .number()
  .positive('Amount must be greater than zero')
  .max(1_000_000, 'Amount cannot exceed 1,000,000 ZAR');

const currency = z
  .enum(['ZAR', 'USD', 'EUR', 'GBP'])
  .default('ZAR');

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
  metadata: z.record(z.any()).optional().default({}),
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
};

/**
 * Express middleware validator
 * Usage: app.post('/payment', validate(validators.processPayment), handler)
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

    // Replace req.body with validated and typed data
    req.body = result.data;
    next();
  };
};

/**
 * Type exports for clean usage in services/DTOs
 */
export type ProcessPaymentInput = z.infer<typeof processPayment>;
export type WebhookEventInput = z.infer<typeof webhookEvent>;

export default validators;