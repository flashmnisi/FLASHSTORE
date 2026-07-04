// apps/notification-service/src/domain/entities/notification.entity.ts

export type NotificationType =
  | 'user.registered'
  | 'order.created'
  | 'payment.success'
  | 'payment.failed'
  | 'order.status.updated';

export type NotificationStatus =
  | 'pending'
  | 'sent'
  | 'failed'
  | 'permanently_failed';
export type NotificationChannel = 'email' | 'sms' | 'push';

export class NotificationEntity {
  constructor(
    public id: string,
    public userId: string,
    public type: string,
    public templateName: string,
    public templateData: any,
    public data: any,
    public title: string,
    public message: string,
    public status: NotificationStatus = 'pending',
    public channel: NotificationChannel,
    public createdAt?: Date
  ) {
    this.createdAt = createdAt || new Date();
  }
}
