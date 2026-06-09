/**
 * =============================================
 * FLASHSTORE KAFKA TOPICS & EVENTS (CLEAN)
 * =============================================
 */

export const TOPICS = {
  // ================= CORE BUSINESS =================
  USERS: 'flashstore.users',
  AUTH: 'flashstore.auth',
  ORDERS: 'flashstore.orders',
  PAYMENTS: 'flashstore.payments',
  PRODUCTS: 'flashstore.products',
  CATEGORIES: 'flashstore.categories',
  CARTS: 'flashstore.carts',
  INVENTORY: 'flashstore.inventory',
  NOTIFICATIONS: 'flashstore.notifications',

  // ================= ANALYTICS =================
  ANALYTICS: 'flashstore.analytics',
  METRICS: 'flashstore.metrics',

  // ================= SYSTEM =================
  SYSTEM: 'flashstore.system',
} as const;

/**
 * =============================================
 * EVENTS (STANDARDIZED NAMING)
 * =============================================
 */
export const EVENTS = {
  // ================= USERS =================
  USER_REGISTERED: 'user.registered',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',

  // ================= AUTH =================
  USER_LOGGED_IN: 'user.logged_in',
  USER_LOGGED_OUT: 'user.logged_out',
  PASSWORD_RESET_REQUESTED: 'user.password_reset_requested',
  PASSWORD_RESET_COMPLETED: 'user.password_reset_completed',

  // ================= ORDERS =================
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_STATUS_UPDATED: 'order.status.updated',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_COMPLETED: 'order.completed',

  // ================= PAYMENTS =================
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',
  PAYMENT_SUCCEEDED: 'payment.succeeded', 

  // ================= PRODUCTS =================
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  PRODUCT_VIEWED: 'product.viewed',
  PRODUCT_INDEXED: 'product.indexed',
  PRODUCT_REINDEX_REQUESTED: 'product.reindex.requested',

  // ================= CATEGORIES =================
  CATEGORY_CREATED: 'category.created',
  CATEGORY_UPDATED: 'category.updated',
  CATEGORY_DELETED: 'category.deleted',

  // ================= CART =================
  CART_UPDATED: 'cart.updated',
  CART_CLEARED: 'cart.cleared',
  CART_CHECKED_OUT: 'cart.checked_out', 

  // ================= NOTIFICATIONS =================
  NOTIFICATION_SENT: 'notification.sent',
  NOTIFICATION_FAILED: 'notification.failed',

  // ================= INVENTORY =================
  STOCK_UPDATED: 'inventory.stock.updated',
  STOCK_RESERVED: 'inventory.stock.reserved', 
  STOCK_RELEASED: 'inventory.stock.released',
  STOCK_DEDUCTED: 'inventory.stock.deducted',
  STOCK_ADJUSTED: 'inventory.stock.adjusted',

  // ================= ANALYTICS =================
  METRIC_GENERATED: 'metric.generated',
} as const;

/**
 * =============================================
 * TYPE SAFETY
 * =============================================
 */
export type Topic = typeof TOPICS[keyof typeof TOPICS];
export type EventType = typeof EVENTS[keyof typeof EVENTS];

/**
 * =============================================
 * HELPERS
 * =============================================
 */
export const isUserEvent = (e: string) => e.startsWith('user.');
export const isOrderEvent = (e: string) => e.startsWith('order.');
export const isPaymentEvent = (e: string) => e.startsWith('payment.');
export const isProductEvent = (e: string) => e.startsWith('product.');
export const isInventoryEvent = (e: string) => e.startsWith('inventory.');

/**
 * Retry / DLQ helpers
 */
export const getRetryTopic = (topic: Topic) => `${topic}.retry`;
export const getDLQTopic = (topic: Topic) => `${topic}.dlq`;

/**
 * Default export
 */
export default {
  TOPICS,
  EVENTS,
  getRetryTopic,
  getDLQTopic,
};