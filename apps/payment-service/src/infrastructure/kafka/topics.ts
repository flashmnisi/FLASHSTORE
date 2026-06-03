// // apps/payment-service/src/infrastructure/kafka/topics/topics.ts

// /**
//  * Centralized Topics and Events for Payment Service
//  */

// export const TOPICS = {
//   PAYMENTS: 'flashstore.payments',   // Payment domain events
//   ORDERS: 'flashstore.orders',       // Listen to events from Order Service
//   USERS: 'flashstore.users',         // Optional: listen to user events
// } as const;

// export const EVENTS = {
//   // Payment Events (outgoing)
//   PAYMENT_INITIATED: 'payment.initiated',
//   PAYMENT_SUCCEEDED: 'payment.succeeded',
//   PAYMENT_FAILED: 'payment.failed',
//   PAYMENT_PROCESSING: 'payment.processing',

//   // Incoming Events from other services
//   ORDER_CREATED: 'order.created',
//   ORDER_CANCELLED: 'order.cancelled',
//   ORDER_COMPLETED: 'order.completed',
// } as const;

// // Type helpers
// export type Topic = typeof TOPICS[keyof typeof TOPICS];
// export type EventType = typeof EVENTS[keyof typeof EVENTS];

// // Helper functions for type safety
// export const isPaymentEvent = (event: string): boolean => 
//   event.startsWith('payment.');

// export const isOrderEvent = (event: string): boolean => 
//   event.startsWith('order.');