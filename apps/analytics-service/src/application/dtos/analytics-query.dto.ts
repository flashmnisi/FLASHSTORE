// apps/analytics-service/src/application/dtos/analytics-query.dto.ts

import { z } from 'zod';

export const analyticsQuerySchema = z.object({
  eventType: z.string().optional(),
  userId: z.string().optional(),
  productId: z.string().optional(),
  orderId: z.string().optional(),
  
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  
  limit: z.number().int().min(1).max(500).default(50),
  page: z.number().int().min(1).default(1),
  
  groupBy: z.enum(['day', 'week', 'month']).optional(),
});

export type AnalyticsQueryDto = z.infer<typeof analyticsQuerySchema>;