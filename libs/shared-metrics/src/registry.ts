import {
  Registry,
  collectDefaultMetrics,
} from 'prom-client';

/**
 * Global Prometheus registry.
 */
export const register = new Registry();

/**
 * Labels applied to every metric automatically.
 */
register.setDefaultLabels({
  app: 'flashstore',
  environment: process.env.NODE_ENV ?? 'development',
  version: process.env.APP_VERSION ?? '1.0.0',
});

/**
 * Collect Node.js and process metrics.
 *
 * Includes:
 * - CPU Usage
 * - Memory Usage
 * - Heap Statistics
 * - Event Loop Lag
 * - Garbage Collection
 * - Process Uptime
 */
collectDefaultMetrics({
  register,
  prefix: 'flashstore_',
});

/**
 * Prometheus content type.
 */
export const contentType = register.contentType;

export default register;