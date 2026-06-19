// apps/notification-service/src/domain/entities/notification.entity.ts

export type NotificationType =
  | 'user.registered'
  | 'order.created'
  | 'payment.success'
  | 'payment.failed'
  | 'order.status.updated';

export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'permanently_failed';
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


// export class NotificationEntity {
//   constructor(
//     public readonly id: string,
//     public userId: string,
//     public type: NotificationType,
//     public title: string,
//     public message: string,
//     public data?: any,
//     public status: 'pending' | 'sent' | 'failed' = 'pending',
//     public channel?: 'email' | 'sms' | 'push',
//     public createdAt: Date = new Date()
//   ) {}
// }

// export enum NotificationType {
//   USER_REGISTERED = 'user.registered',
//   ORDER_CREATED = 'order.created',
//   PAYMENT_SUCCESS = 'payment.success',
//   PAYMENT_FAILED = 'payment.failed',
//   ORDER_STATUS_UPDATED = 'order.status.updated',
// }

