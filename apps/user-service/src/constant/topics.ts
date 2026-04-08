// apps/user-service/src/constants/topics.ts

export const TOPICS = {
  EVENTS: 'flashstore.events',           // General events topic (recommended)
  USERS: 'flashstore.users',
  ORDERS: 'flashstore.orders',
  PAYMENTS: 'flashstore.payments',
  NOTIFICATIONS: 'flashstore.notifications',
  CART: 'flashstore.cart',
} as const;

export const EVENT_TYPES = {
  // User events
  USER_REGISTERED: 'user.registered',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_PROFILE_UPDATED: 'user.profile.updated',

  // Order events
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_STATUS_CHANGED: 'order.status.changed',
  ORDER_CANCELLED: 'order.cancelled',

  // Payment events
  PAYMENT_SUCCESS: 'payment.success',
  PAYMENT_FAILED: 'payment.failed',

  // Cart events
  CART_UPDATED: 'cart.updated',
  CART_CLEARED: 'cart.cleared',

  // Test / General
  TEST_EVENT: 'test_event',
} as const;

export type Topic = typeof TOPICS[keyof typeof TOPICS];
export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];