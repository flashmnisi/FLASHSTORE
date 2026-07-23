// libs/shared-metrics/src/metrics/mongodb.ts

import { Counter, Gauge, Histogram } from 'prom-client';
import { register } from '../registry';

/**
 * Database queries executed.
 */
export const databaseQueriesTotal = new Counter({
  name: 'flashstore_database_queries_total',
  help: 'Total MongoDB queries executed',
  labelNames: ['service', 'collection', 'operation'],
  registers: [register],
});

/**
 * Database query failures.
 */
export const databaseErrorsTotal = new Counter({
  name: 'flashstore_database_errors_total',
  help: 'Total MongoDB query errors',
  labelNames: ['service', 'collection', 'operation'],
  registers: [register],
});

/**
 * MongoDB active connections.
 */
export const mongodbConnections = new Gauge({
  name: 'flashstore_mongodb_connections',
  help: 'Current MongoDB connections',
  labelNames: ['service'],
  registers: [register],
});

/**
 * MongoDB connection pool size.
 */
export const mongodbConnectionPoolSize = new Gauge({
  name: 'flashstore_mongodb_connection_pool_size',
  help: 'MongoDB connection pool size',
  labelNames: ['service'],
  registers: [register],
});

/**
 * MongoDB query duration.
 */
export const mongodbQueryDuration = new Histogram({
  name: 'flashstore_mongodb_query_duration_seconds',
  help: 'MongoDB query duration',
  labelNames: ['service', 'collection', 'operation'],
  buckets: [
    0.001,
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
 * MongoDB documents returned.
 */
export const mongodbDocumentsReturned = new Histogram({
  name: 'flashstore_mongodb_documents_returned',
  help: 'Documents returned by MongoDB queries',
  labelNames: ['service', 'collection'],
  buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000],
  registers: [register],
});

/**
 * MongoDB transaction duration.
 */
export const mongodbTransactionDuration = new Histogram({
  name: 'flashstore_mongodb_transaction_duration_seconds',
  help: 'MongoDB transaction duration',
  labelNames: ['service'],
  buckets: [
    0.005,
    0.01,
    0.05,
    0.1,
    0.5,
    1,
    2,
    5,
  ],
  registers: [register],
});