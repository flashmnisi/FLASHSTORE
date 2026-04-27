// ====================== TOPICS ======================
export const TOPICS = {
  // Core Business Topics
  ORDERS: 'flashstore.orders',
  PAYMENTS: 'flashstore.payments',
  CART: 'flashstore.cart',
  INVENTORY: 'flashstore.inventory',
  NOTIFICATIONS: 'flashstore.notifications',
  USERS: 'flashstore.users',

  // Internal Events
  OUTBOX: 'flashstore.outbox',
} as const;

// ====================== EVENTS ======================
export const EVENTS = {
  // Order Events
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_STATUS_UPDATED: 'order.status.updated',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_COMPLETED: 'order.completed',

  // Payment Events
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',

  // Cart Events
  CART_UPDATED: 'cart.updated',
  CART_CLEARED: 'cart.cleared',
  CART_CHECKED_OUT: 'cart.checked_out',     // ← Added

  // User Events
  USER_REGISTERED: 'user.registered',
  USER_UPDATED: 'user.updated',

  // Inventory Events
  INVENTORY_RESERVED: 'inventory.reserved',
  INVENTORY_RELEASED: 'inventory.released',

  // Notification Events
  NOTIFICATION_SENT: 'notification.sent',
  NOTIFICATION_FAILED: 'notification.failed',

  // Outbox Pattern
  OUTBOX_PROCESSED: 'outbox.processed',
} as const;

// ====================== TYPES ======================
export type Topic = typeof TOPICS[keyof typeof TOPICS];
export type EventType = typeof EVENTS[keyof typeof EVENTS];

// Helper functions
export const isOrderEvent = (event: string): boolean => 
  event.startsWith('order.');

export const isPaymentEvent = (event: string): boolean => 
  event.startsWith('payment.');

export const isCartEvent = (event: string): boolean => 
  event.startsWith('cart.');