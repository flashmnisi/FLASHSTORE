export type NotificationType =
  | 'user.registered'
  | 'order.created'
  | 'payment.success'
  | 'payment.failed'
  | 'order.status.updated';

export type NotificationChannel = 'email' | 'sms' | 'push';

export class NotificationEntity {
  constructor(
    public readonly id: string,
    public userId: string,
    public type: NotificationType,

    // 🔥 Template-driven system
    public templateName: string,
    public templateData: Record<string, unknown>,  

    public recipient: string,

    // Rendered output (optional cache)
    public title?: string,
    public message?: string,

    public status: 'pending' | 'sent' | 'failed' = 'pending',
    public channel: NotificationChannel = 'email',

    public createdAt: Date = new Date()
  ) {}
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

