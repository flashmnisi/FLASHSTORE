// apps/payment-service/src/application/dtos/stripe-webhook.dto.ts

import { z } from 'zod';

export const stripeWebhookSchema = z.object({
  id: z.string(),
  type: z.enum([
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'payment_intent.processing',
    'payment_intent.canceled',
  ]),

  data: z.object({
    object: z.object({
      id: z.string(),
      amount: z.number().nonnegative(),
      currency: z.string().length(3).toUpperCase(),
      status: z.string().optional(),

      // Last payment error
      last_payment_error: z
        .object({
          message: z.string().optional(),
          type: z.string().optional(),
          code: z.string().optional(),
        })
        .optional()
        .nullable(),

      // Metadata from Stripe
      metadata: z
        .object({
          orderId: z.string().optional(),
          userId: z.string().optional(),
        })
        .optional()
        .default({}),

      receipt_url: z.string().url().optional(),
    }),
  }),

  created: z.number().int().positive(),
  livemode: z.boolean(),
});

export type StripeWebhookDto = z.infer<typeof stripeWebhookSchema>;
