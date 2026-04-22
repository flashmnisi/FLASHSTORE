export class NotificationEntity {
  constructor(
    public readonly id: string,
    public userId: string,
    public type: NotificationType,
    public title: string,
    public message: string,
    public data?: any,
    public status: 'pending' | 'sent' | 'failed' = 'pending',
    public channel: 'email' | 'sms' | 'push',
    public createdAt: Date = new Date()
  ) {}
}

export enum NotificationType {
  USER_REGISTERED = 'user.registered',
  ORDER_CREATED = 'order.created',
  PAYMENT_SUCCESS = 'payment.success',
  PAYMENT_FAILED = 'payment.failed',
  ORDER_STATUS_UPDATED = 'order.status.updated',
}