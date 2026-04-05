export const TOPICS = {
  EVENTS: 'flashstore.events',
  USER_EVENTS: 'flashstore.users',
  ORDER_EVENTS: 'flashstore.orders',
  PAYMENT_EVENTS: 'flashstore.payments',
  NOTIFICATION_EVENTS: 'flashstore.notifications',
} as const;

export const EVENT_TYPES = {
  USER_REGISTERED: 'user.registered',
  USER_UPDATED: 'user.updated',
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  PAYMENT_SUCCESS: 'payment.success',
  PAYMENT_FAILED: 'payment.failed',
  TEST_EVENT: 'test_event',
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];
export type Topic = typeof TOPICS[keyof typeof TOPICS];