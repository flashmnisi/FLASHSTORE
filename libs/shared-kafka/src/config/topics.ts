export const TOPICS = {
  // USER
  USER_REGISTERED: 'flashstore.user.registered',
  USER_LOGGED_IN: 'flashstore.user.logged_in',

  // ORDER
  ORDER_CREATED: 'flashstore.order.created',
  ORDER_STATUS_UPDATED: 'flashstore.order.status.updated',

  // PAYMENT
  PAYMENT_INITIATED: 'flashstore.payment.initiated',
  PAYMENT_COMPLETED: 'flashstore.payment.completed',
  PAYMENT_FAILED: 'flashstore.payment.failed',

  // CART
  CART_UPDATED: 'flashstore.cart.updated',

  // NOTIFICATIONS
  NOTIFICATION_SENT: 'flashstore.notification.sent',

  // SYSTEM
  RETRY_SUFFIX: '.retry',
  DLQ_SUFFIX: '.dlq',
} as const;

export type Topic = typeof TOPICS[keyof typeof TOPICS];

// Helpers
export const getRetryTopic = (topic: string) => `${topic}.retry`;
export const getDLQTopic = (topic: string) => `${topic}.dlq`;