import { Gauge } from 'prom-client';
import register from '../registry';

/**
 * Active HTTP requests.
 */
export const activeHttpRequests = new Gauge({
  name: 'flashstore_http_requests_active',
  help: 'Current active HTTP requests',
  registers: [register],
});

/**
 * Connected users.
 */
export const connectedUsers = new Gauge({
  name: 'flashstore_connected_users',
  help: 'Connected users',
  registers: [register],
});

/**
 * Service health.
 */
export const serviceHealth = new Gauge({
  name: 'flashstore_service_health',
  help: '1 = healthy, 0 = unhealthy',
  labelNames: ['service'],
  registers: [register],
});