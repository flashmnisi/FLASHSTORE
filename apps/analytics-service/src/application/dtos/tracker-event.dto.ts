// apps/analytics-service/src/application/dtos/track-event.dto.ts

import { z } from 'zod';

export const trackEventSchema = z.object({
  eventType: z.string().min(3),
  userId: z.string().optional(),
  productId: z.string().optional(),
  orderId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).default({}),
  timestamp: z.string().datetime().optional(),
});

export type TrackEventDto = z.infer<typeof trackEventSchema>;