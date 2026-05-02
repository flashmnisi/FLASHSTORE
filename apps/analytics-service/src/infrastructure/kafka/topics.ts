// apps/analytics-service/src/infrastructure/kafka/topics.ts

/**
 * Centralized Kafka Topics & Events for Analytics Service
 */

export const TOPICS = {
  // Incoming events from other services
  USERS: 'flashstore.users',
  ORDERS: 'flashstore.orders',
  PAYMENTS: 'flashstore.payments',
  PRODUCTS: 'flashstore.products',
  CART: 'flashstore.cart',

  // Analytics internal topics
  ANALYTICS: 'flashstore.analytics',
  METRICS: 'flashstore.metrics',
} as const;

export const EVENTS = {
  // User Events
  USER_REGISTERED: 'user.registered',
  USER_UPDATED: 'user.updated',
  USER_LOGGED_IN: 'user.logged_in',

  // Order Events
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_COMPLETED: 'order.completed',

  // Payment Events
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_PROCESSING: 'payment.processing',

  // Product Events
  PRODUCT_VIEWED: 'product.viewed',
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  STOCK_UPDATED: 'product.stock.updated',

  // Analytics Internal Events
  METRIC_GENERATED: 'metric.generated',
  DASHBOARD_UPDATED: 'dashboard.updated',
} as const;

// Type exports for better type safety
export type AnalyticsTopic = typeof TOPICS[keyof typeof TOPICS];
export type AnalyticsEvent = typeof EVENTS[keyof typeof EVENTS];

// Helper functions
export const isUserEvent = (event: string): boolean => 
  event.startsWith('user.');

export const isOrderEvent = (event: string): boolean => 
  event.startsWith('order.');

export const isPaymentEvent = (event: string): boolean => 
  event.startsWith('payment.');

export const isProductEvent = (event: string): boolean => 
  event.startsWith('product.');

export default {
  TOPICS,
  EVENTS,
};