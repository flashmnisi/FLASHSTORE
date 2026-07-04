import { z } from 'zod';

export const sendNotificationSchema = z.object({
  templateName: z.string().min(1),
  templateData: z.record(z.string(), z.any()),

  userId: z.string().min(1),

  type: z.enum([
    'user.registered',
    'order.created',
    'payment.success',
    'payment.failed',
    'payment.completed',
  ]),

  title: z.string().min(1),
  message: z.string().min(1),

  data: z.any().optional(),

  channel: z.enum(['email', 'sms', 'push']).default('email'),
});

export type SendNotificationDto = z.infer<typeof sendNotificationSchema>;
