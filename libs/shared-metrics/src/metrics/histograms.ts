import { Histogram } from 'prom-client';
import register from '../registry';

/**
 * HTTP latency.
 */
export const httpRequestDuration = new Histogram({
  name: 'flashstore_http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status'],
  buckets: [
    0.005,
    0.01,
    0.025,
    0.05,
    0.1,
    0.25,
    0.5,
    1,
    2,
    5,
  ],
  registers: [register],
});

/**
 * Database query duration.
 */
export const dbQueryDuration = new Histogram({
  name: 'flashstore_db_query_duration_seconds',
  help: 'MongoDB query duration',
  labelNames: ['collection', 'operation'],
  buckets: [
    0.001,
    0.005,
    0.01,
    0.05,
    0.1,
    0.25,
    0.5,
    1,
    2,
  ],
  registers: [register],
});