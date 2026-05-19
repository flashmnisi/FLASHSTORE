// apps/gateway/src/infrastructure/kafka/topics.ts

/**
 * Kafka Topics & Events for API Gateway
 */

export const TOPICS = {
  // Gateway Events
  GATEWAY: 'flashstore.gateway',
  EVENTS: 'flashstore.events',

  // Internal Communication
  NOTIFICATIONS: 'flashstore.notifications',
  ANALYTICS: 'flashstore.analytics',
} as const;

export const EVENTS = {
  // Gateway Events
  REQUEST_PROXIED: 'gateway.request.proxied',
  GATEWAY_ERROR: 'gateway.error',
  SERVICE_UNAVAILABLE: 'gateway.service.unavailable',

  // Authentication Events
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  TOKEN_REFRESHED: 'user.token.refreshed',

  // Business Events (Gateway forwards/publishes)
  ORDER_CREATED: 'order.created',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PRODUCT_VIEWED: 'product.viewed',
  USER_REGISTERED: 'user.registered',

  // System Events
  CIRCUIT_BREAKER_OPENED: 'system.circuit.opened',
  RATE_LIMIT_EXCEEDED: 'system.rate_limit.exceeded',
} as const;

// Type exports
export type GatewayTopic = typeof TOPICS[keyof typeof TOPICS];
export type GatewayEvent = typeof EVENTS[keyof typeof EVENTS];

// Helper functions
export const isGatewayEvent = (event: string): boolean => 
  event.startsWith('gateway.');

export const isUserEvent = (event: string): boolean => 
  event.startsWith('user.');

export const isOrderEvent = (event: string): boolean => 
  event.startsWith('order.');

export default {
  TOPICS,
  EVENTS,
};