// // apps/order-service/src/infrastructure/kafka/topics.ts

// export const TOPICS = {
//   ORDERS: 'flashstore.orders',
//   PAYMENTS: 'flashstore.payments',
//   INVENTORY: 'flashstore.inventory',
//   NOTIFICATIONS: 'flashstore.notifications',
//   USERS: 'flashstore.users',
// } as const;

// export const EVENTS = {
//   // Order Events
//   ORDER_CREATED: 'order.created',
//   ORDER_UPDATED: 'order.updated',
//   ORDER_STATUS_UPDATED: 'order.status.updated',
//   ORDER_CANCELLED: 'order.cancelled',
//   ORDER_COMPLETED: 'order.completed',

//   // Payment Events
//   PAYMENT_COMPLETED: 'payment.completed',
//   PAYMENT_FAILED: 'payment.failed',
//   PAYMENT_REFUNDED: 'payment.refunded',

//   // User Events
//   USER_REGISTERED: 'user.registered',
// } as const;

// export type Topic = typeof TOPICS[keyof typeof TOPICS];
// export type EventType = typeof EVENTS[keyof typeof EVENTS];