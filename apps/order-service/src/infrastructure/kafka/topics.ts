// ====================== TOPICS ======================
export const TOPICS = {
  ORDERS: 'flashstore.orders',
  PAYMENTS: 'flashstore.payments',
  INVENTORY: 'flashstore.inventory',
  NOTIFICATIONS: 'flashstore.notifications',
  USERS: 'flashstore.users',
} as const;

// ====================== EVENTS ======================
export const EVENTS = {
  // Order Events
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_STATUS_UPDATED: 'order.status.updated',   // ← Added this
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_COMPLETED: 'order.completed',

  // Payment Events
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',

  // User Events
  USER_REGISTERED: 'user.registered',

  // Notification Events
  NOTIFICATION_SENT: 'notification.sent',
  NOTIFICATION_FAILED: 'notification.failed',
} as const;

// Type helpers (useful for type safety)
export type Topic = typeof TOPICS[keyof typeof TOPICS];
export type EventType = typeof EVENTS[keyof typeof EVENTS];