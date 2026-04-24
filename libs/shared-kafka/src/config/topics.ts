/**
 * Central topic registry - Single Source of Truth
 */
export const TOPICS = {
  // User Domain
  USER_REGISTERED: 'flashstore.user.registered',
  USER_LOGGED_IN: 'flashstore.user.logged_in',
  USER_UPDATED: 'flashstore.user.updated',

  // Order Domain
  ORDER_CREATED: 'flashstore.order.created',
  ORDER_STATUS_UPDATED: 'flashstore.order.status.updated',
  ORDER_CANCELLED: 'flashstore.order.cancelled',

  // Payment Domain
  PAYMENT_INITIATED: 'flashstore.payment.initiated',
  PAYMENT_COMPLETED: 'flashstore.payment.completed',
  PAYMENT_FAILED: 'flashstore.payment.failed',

  // Cart Domain
  CART_UPDATED: 'flashstore.cart.updated',
  CART_CLEARED: 'flashstore.cart.cleared',

  // Catalog Domain
  PRODUCT_CREATED: 'flashstore.product.created',
  PRODUCT_UPDATED: 'flashstore.product.updated',
  PRODUCT_DELETED: 'flashstore.product.deleted',

  // Notification Domain
  NOTIFICATION_SENT: 'flashstore.notification.sent',

  // System / Internal
  SYSTEM_EVENTS: 'flashstore.system.events',
} as const;

export type TopicName = keyof typeof TOPICS;
export type TopicValue = typeof TOPICS[TopicName];

/**
 * Helper functions for retry and DLQ topics
 */
export const getRetryTopic = (originalTopic: string): string => 
  `${originalTopic}.retry`;

export const getDLQTopic = (originalTopic: string): string => 
  `${originalTopic}.dlq`;