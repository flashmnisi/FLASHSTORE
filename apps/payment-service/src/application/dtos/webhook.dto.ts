import { z } from 'zod';

export const stripeWebhookSchema = z.object({
  id: z.string(),
  type: z.enum([
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'payment_intent.processing',
  ]),
  data: z.object({
    object: z.object({
      id: z.string(),
      amount: z.number(),
      currency: z.string(),
      metadata: z.object({
        orderId: z.string(),
        userId: z.string(),
      }).optional(),
    }),
  }),
  created: z.number(),
  livemode: z.boolean(),
});

export type StripeWebhookDto = z.infer<typeof stripeWebhookSchema>;