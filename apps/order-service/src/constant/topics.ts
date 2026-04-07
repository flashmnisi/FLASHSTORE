export const TOPICS = {
  ORDERS: 'flashstore.orders',
  PAYMENTS: 'flashstore.payments',
  INVENTORY: 'flashstore.inventory',
  NOTIFICATIONS: 'flashstore.notifications',
} as const;

export const ORDER_EVENTS = {
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_COMPLETED: 'order.completed',
} as const;