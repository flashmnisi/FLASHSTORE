import { z } from 'zod';

export const sendNotificationSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(['user.registered', 'order.created', 'payment.success', 'payment.failed']),
  title: z.string().min(1),
  message: z.string().min(1),
  data: z.any().optional(),
  channel: z.enum(['email', 'sms', 'push']).default('email'),
});

export type SendNotificationDto = z.infer<typeof sendNotificationSchema>;