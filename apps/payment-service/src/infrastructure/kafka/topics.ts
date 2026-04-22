// apps/payment-service/src/infrastructure/kafka/topics.ts

export const EVENTS = {
  USER_REGISTERED: 'user.registered',

  ORDER_CREATED: 'order.created',
  ORDER_STATUS_UPDATED: 'order.status.updated',

  PAYMENT_INITIATED: 'payment.initiated',  
  PAYMENT_COMPLETED: 'payment.completed',  
  PAYMENT_FAILED: 'payment.failed',

  NOTIFICATION_SENT: 'notification.sent',
} as const;