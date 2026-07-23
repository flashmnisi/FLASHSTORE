// libs/shared-metrics/src/metrics/counters.ts

import { Counter } from 'prom-client';
import { register } from '../registry';

/**
 * Total HTTP requests.
 */
export const httpRequestsTotal = new Counter({
  name: 'flashstore_http_requests_total',
  help: 'Total HTTP requests received',
  labelNames: ['service', 'method', 'route', 'status'],
  registers: [register],
});

/**
 * Total HTTP errors.
 */
export const httpErrorsTotal = new Counter({
  name: 'flashstore_http_errors_total',
  help: 'Total HTTP errors',
  labelNames: ['service', 'method', 'route', 'status'],
  registers: [register],
});

/**
 * Uncaught exceptions.
 */
export const uncaughtExceptionsTotal = new Counter({
  name: 'flashstore_uncaught_exceptions_total',
  help: 'Total uncaught exceptions',
  labelNames: ['service'],
  registers: [register],
});

/**
 * External API requests.
 */
export const externalApiRequestsTotal = new Counter({
  name: 'flashstore_external_api_requests_total',
  help: 'External API requests',
  labelNames: ['service', 'provider', 'status'],
  registers: [register],
});