// apps/gateway/src/infrastructure/kafka/topics.ts

export const TOPICS = {
  GATEWAY: 'flashstore.gateway',
  EVENTS: 'flashstore.events',
  ANALYTICS: 'flashstore.analytics',
  NOTIFICATIONS: 'flashstore.notifications',
} as const;

export const EVENTS = {
  REQUEST_PROXIED: 'gateway.request.proxied',
  GATEWAY_ERROR: 'gateway.error',
  SERVICE_UNAVAILABLE: 'gateway.service.unavailable',

  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',

  ORDER_CREATED: 'order.created',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PRODUCT_VIEWED: 'product.viewed',
} as const;

export type GatewayTopic =
  typeof TOPICS[keyof typeof TOPICS];

export type GatewayEvent =
  typeof EVENTS[keyof typeof EVENTS];