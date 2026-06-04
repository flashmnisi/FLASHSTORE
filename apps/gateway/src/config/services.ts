// apps/gateway/src/config/services.ts

import env from './env';

export const services = {
  auth: env.USER_SERVICE_URL,
  user: env.USER_SERVICE_URL,
  catalog: env.CATALOG_SERVICE_URL,
  cart: env.CART_SERVICE_URL,
  order: env.ORDER_SERVICE_URL,
  payment: env.PAYMENT_SERVICE_URL,
  analytics: env.ANALYTICS_SERVICE_URL,
  search: env.SEARCH_SERVICE_URL,
  notification: env.NOTIFICATION_SERVICE_URL,
  inventory: env.INENTORY_SERVICE_URL
} as const;

export type ServiceKey = keyof typeof services;

/**
 * Get full service URL by key
 */
export const getServiceUrl = (service: ServiceKey): string => {
  const url = services[service];
  if (!url) {
    throw new Error(`Service URL not configured for: ${service}`);
  }
  return url;
};

/**
 * Health check endpoints for each service
 */
export const healthCheckPaths = {
  user: '/health',
  catalog: '/health',
  cart: '/health',
  order: '/health',
  payment: '/health',
  analytics: '/health',
  search: '/health',
  inventory: '/health'
} as const;