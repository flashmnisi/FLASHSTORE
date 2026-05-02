// apps/analytics-service/src/utils/validators.ts

import { z } from 'zod';

export const trackEventSchema = z.object({
  eventType: z.string().min(3, 'Event type is required'),
  userId: z.string().optional(),
  productId: z.string().optional(),
  orderId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).default({}),
  timestamp: z.string().datetime().optional(),
});

export const validators = {
  trackEvent: trackEventSchema,
  // ... other validators
} as const;

export type TrackEventDto = z.infer<typeof trackEventSchema>;