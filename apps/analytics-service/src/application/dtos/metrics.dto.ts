// apps/analytics-service/src/application/dtos/metrics.dto.ts

import { z } from 'zod';

export const metricsQuerySchema = z.object({
  metricType: z.enum([
    'daily_sales',
    'user_signups',
    'order_count',
    'revenue',
    'top_products',
    'conversion_rate',
    'average_order_value',
  ]),
  
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  
  // Optional filters
  categoryId: z.string().optional(),
  userId: z.string().optional(),
  
  // Granularity
  interval: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
});

export const dashboardMetricsSchema = z.object({
  period: z.enum(['today', 'this_week', 'this_month', 'last_30_days']),
});

export type MetricsQueryDto = z.infer<typeof metricsQuerySchema>;
export type DashboardMetricsDto = z.infer<typeof dashboardMetricsSchema>;