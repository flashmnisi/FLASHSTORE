/**
 * =============================================
 * CENTRALIZED KAFKA TOPICS & EVENTS
 * =============================================
 * Use this file in ALL services (order, analytics, user, payment, etc.)
 */

export const TOPICS = {
  // Core Business Topics
  USERS: 'flashstore.users',
  AUTH: 'flashstore.auth',
  ORDERS: 'flashstore.orders',
  PAYMENTS: 'flashstore.payments',
  PRODUCTS: 'flashstore.products',
  CATEGORIES: 'flashstore.categories',
  CARTS: 'flashstore.carts',
  INVENTORY: 'flashstore.inventory',
  NOTIFICATIONS: 'flashstore.notifications',

  // Analytics & Internal
  ANALYTICS: 'flashstore.analytics',
  METRICS: 'flashstore.metrics',

  // System
  SYSTEM: 'flashstore.system',
} as const;

export const EVENTS = {
  // ==================== USER EVENTS ====================
  USER_REGISTERED: 'user.registered',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',

  // ==================== AUTH EVENTS ====================
  USER_LOGGED_IN: 'user.logged_in',
  USER_LOGGED_OUT: 'user.logged_out',
  PASSWORD_RESET_REQUESTED: 'user.password_reset_requested',
  PASSWORD_RESET_COMPLETED: 'user.password_reset_completed',

  // ==================== ORDER EVENTS ====================
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_STATUS_UPDATED: 'order.status.updated',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_COMPLETED: 'order.completed',

  // ==================== PAYMENT EVENTS ====================
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',
  PAYMENT_SUCCEEDED:'payment.succeded',

  // ========== PRODUCT and CATEGORY EVENTS ============
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  PRODUCT_VIEWED: 'product.viewed',

  CATEGORY_CREATED: 'category.created',
  CATEGORY_UPDATED: 'category.updated',
  CATEGORY_DELETED: 'category.deleted',

  // ==================== CART EVENTS ====================
  CART_UPDATED: 'cart.updated',
  CART_CLEARED: 'cart.cleared',
  CART_CHECKED_OUT: 'cart.checkedout',

  // ==================== NOTIFICATION EVENTS ====================
  NOTIFICATION_SENT: 'notification.sent',
  NOTIFICATION_FAILED: 'notification.failed',

  // ==================== INVENTORY EVENTS ====================
  STOCK_UPDATED: 'inventory.stock.updated',
  STOCK_RESERVED: 'inventory.stock.reversed',
  STOCK_RELEASED: 'inventory.stock.released',
  STOCK_DEDUCTED: 'inventory.stock.deducted',
  STOCK_ADJUSTED: 'inventory.stock.adjust',

  // ==================== ANALYTICS EVENTS ====================
  METRIC_GENERATED: 'metric.generated',

  // Search / Indexing Events
  PRODUCT_INDEXED: 'product.indexed',
  PRODUCT_REINDEX_REQUESTED: 'product.reindex.requested',

} as const;

// Type exports for better type safety
export type Topic = typeof TOPICS[keyof typeof TOPICS];
export type EventType = typeof EVENTS[keyof typeof EVENTS];

// Helper functions
export const isUserEvent = (event: string): boolean => event.startsWith('user.');
export const isOrderEvent = (event: string): boolean => event.startsWith('order.');
export const isPaymentEvent = (event: string): boolean => event.startsWith('payment.');
export const isProductEvent = (event: string): boolean => event.startsWith('product.');

// Retry & DLQ helpers
export const getRetryTopic = (topic: Topic): string => `${topic}.retry`;
export const getDLQTopic = (topic: Topic): string => `${topic}.dlq`;

export default {
  TOPICS,
  EVENTS,
  getRetryTopic,
  getDLQTopic,
};