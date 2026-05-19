// // apps/analytics-service/src/infrastructure/kafka/topics.ts

// /**
//  * Centralized Kafka Topics & Events for Analytics Service
//  */

// export const TOPICS = {
//   // Incoming events from other services
//   AUTH: 'flashstore.auth',
//   USERS: 'flashstore.users',
//   PAYMENTS: 'flashstore.payments',
//   CARTS: 'flashstore.carts',
//   PRODUCTS: 'flashstore.products',
//   NOTIFICATIONS: 'flashstore.notifications',
//   ORDERS: 'flashstore.orders',
//   INVENTORY: 'flashstore.inventory',
//   SYSTEM: 'flashstore.system',

//   // Analytics internal topics
//   ANALYTICS: 'flashstore.analytics',
//   METRICS: 'flashstore.metrics',
// } as const;

// export const EVENTS = {
//   // User Events
//   USER_REGISTERED: 'user.registered',
//   USER_UPDATED: 'user.updated',
//   USER_DELETED: 'user.deleted',
//   PASSWORD_RESET_REQUESTED: 'user.password_reset_requested',
//   PASSWORD_RESET_COMPLETED: 'user.password_reset_completed',

//   // Auth Events
//   USER_LOGGED_IN: 'user.logged_in',
//   USER_LOGGED_OUT: 'user.logged_out',

//   // Order
//   ORDER_CREATED: 'order.created',
//   ORDER_UPDATED: 'order.updated',
//   ORDER_STATUS_UPDATED: 'order.status.updated',
//   ORDER_CANCELLED: 'order.cancelled',
//   ORDER_COMPLETED: 'order.completed',

//   // Payment
//   PAYMENT_INITIATED: 'payment.initiated',
//   PAYMENT_COMPLETED: 'payment.completed',
//   PAYMENT_FAILED: 'payment.failed',

//   // Cart
//   CART_UPDATED: 'cart.updated',
//   CART_CLEARED: 'cart.cleared',


//   // Notification
//   NOTIFICATION_SENT: 'notification.sent',
//   NOTIFICATION_FAILED: 'notification.failed',

//   // Product Events
//   PRODUCT_VIEWED: 'product.viewed',
//   PRODUCT_CREATED: 'product.created',
//   PRODUCT_UPDATED: 'product.updated',
//   PRODUCT_DELETED: 'product.deleted',
//   STOCK_UPDATED: 'product.stock.updated',

//   // Analytics Internal Events
//   METRIC_GENERATED: 'metric.generated',
//   DASHBOARD_UPDATED: 'dashboard.updated',
// } as const;

// // Type exports for better type safety
// export type AnalyticsTopic = typeof TOPICS[keyof typeof TOPICS];
// export type AnalyticsEvent = typeof EVENTS[keyof typeof EVENTS];

// // Helper functions
// export const isUserEvent = (event: string): boolean => 
//   event.startsWith('user.');

// export const isOrderEvent = (event: string): boolean => 
//   event.startsWith('order.');

// export const isPaymentEvent = (event: string): boolean => 
//   event.startsWith('payment.');

// export const isProductEvent = (event: string): boolean => 
//   event.startsWith('product.');

// export default {
//   TOPICS,
//   EVENTS,
// };