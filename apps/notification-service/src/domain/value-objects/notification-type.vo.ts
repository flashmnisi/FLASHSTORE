// domain/value-objects/notification-type.ts

export const NOTIFICATION_TYPES = [
  'user.registered',
  'order.created',
  'payment.success',
  'payment.failed',
  'order.status.updated',
] as const;

export type NotificationType = typeof NOTIFICATION_TYPES[number];

export const toNotificationType = (type: string): NotificationType => {
  if (NOTIFICATION_TYPES.includes(type as NotificationType)) {
    return type as NotificationType;
  }

  throw new Error(`Invalid notification type: ${type}`);
};