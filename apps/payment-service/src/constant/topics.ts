export const TOPICS = {
  PAYMENTS: 'flashstore.payments',
  ORDERS: 'flashstore.orders',
} as const;

export const PAYMENT_EVENTS = {
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_COMPLETED: 'payment.completed', 
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',
} as const;