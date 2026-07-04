// /**
//  * 🔥 Centralized Kafka Topics & Events
//  * Used across all services
//  */

// // =============================
// // 📦 TOPICS
// // =============================
// export const TOPICS = {
//   PRODUCT: 'flashstore.product',
//   CART: 'flashstore.cart',
//   ORDER: 'flashstore.order',
//   PAYMENT: 'flashstore.payment',
//   USER: 'flashstore.user',
//   SEARCH: 'flashstore.search',      
//   ANALYTICS: 'flashstore.analytics',
// } as const;

// // =============================
// // 🔔 EVENTS (by domain)
// // =============================
// export const EVENTS = {
//   PRODUCT: {
//     CREATED: 'product.created',
//     UPDATED: 'product.updated',
//     DELETED: 'product.deleted',
//   },

//   CART: {
//     UPDATED: 'cart.updated',
//     CHECKED_OUT: 'cart.checked_out',
//   },

//   ORDER: {
//     CREATED: 'order.created',
//     CANCELLED: 'order.cancelled',
//     COMPLETED: 'order.completed',
//   },

//   PAYMENT: {
//     INITIATED: 'payment.initiated',
//     COMPLETED: 'payment.completed',
//     FAILED: 'payment.failed',
//   },

//   USER: {
//     CREATED: 'user.created',
//     UPDATED: 'user.updated',
//   },

//   SEARCH: {
//     PERFORMED: 'search.performed',
//     CLICKED: 'search.clicked',
//     SUGGEST_USED: 'search.suggest',
//     TRENDING: 'search.trending',
//   },
// } as const;

// // =============================
// // 🧠 TYPE HELPERS
// // =============================
// export type Topic = typeof TOPICS[keyof typeof TOPICS];

// export type EventType =
//   | typeof EVENTS.PRODUCT[keyof typeof EVENTS.PRODUCT]
//   | typeof EVENTS.CART[keyof typeof EVENTS.CART]
//   | typeof EVENTS.ORDER[keyof typeof EVENTS.ORDER]
//   | typeof EVENTS.PAYMENT[keyof typeof EVENTS.PAYMENT]
//   | typeof EVENTS.USER[keyof typeof EVENTS.USER]
//   | typeof EVENTS.SEARCH[keyof typeof EVENTS.SEARCH];

// // =============================
// // 📩 GENERIC KAFKA MESSAGE
// // =============================
// export interface KafkaEvent<T = any> {
//   event: EventType;
//   data: T;
//   timestamp: string;
//   correlationId?: string;
//   service?: string;
// }