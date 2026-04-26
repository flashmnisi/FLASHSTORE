/**
 * 📦 DOMAIN-BASED TOPICS (Kafka topics)
 * These are the actual Kafka topics (streams)
 */
export const TOPICS = {
  USERS: 'flashstore.users',
  ORDERS: 'flashstore.orders',
  PAYMENTS: 'flashstore.payments',
  CARTS: 'flashstore.carts',
  PRODUCTS: 'flashstore.products',
  NOTIFICATIONS: 'flashstore.notifications',

  // System / Internal
  SYSTEM: 'flashstore.system',
} as const;

export type TopicKey = keyof typeof TOPICS;
export type TopicValue = typeof TOPICS[TopicKey];

/**
 * ⚡ EVENT NAMES (inside message payload)
 * These define what happened inside a topic
 */
export const EVENTS = {
  // User
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.logged_in',
  USER_UPDATED: 'user.updated',

  // Order
  ORDER_CREATED: 'order.created',
  ORDER_STATUS_UPDATED: 'order.status.updated',
  ORDER_CANCELLED: 'order.cancelled',

  // Payment
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',

  // Cart
  CART_UPDATED: 'cart.updated',
  CART_CLEARED: 'cart.cleared',

  // Product
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',

  // Notification
  NOTIFICATION_SENT: 'notification.sent',
  NOTIFICATION_FAILED: 'notification.failed',
} as const;

export type EventType = typeof EVENTS[keyof typeof EVENTS];

/**
 * 🔁 Retry + DLQ helpers
 */
export const getRetryTopic = (topic: string): string => `${topic}.retry`;
export const getDLQTopic = (topic: string): string => `${topic}.dlq`;