import {
  MetricLabels,
  HttpMetricLabels,
  KafkaMetricLabels,
  DatabaseMetricLabels,
  BusinessMetricLabels,
} from '../types/metrics.types';

/**
 * Default labels shared by all FlashStore services.
 */
export function createDefaultLabels(
  service: string
): MetricLabels {
  return {
    service,
    environment: process.env.NODE_ENV ?? 'development',
    version: process.env.APP_VERSION ?? '1.0.0',
  };
}

/**
 * HTTP request labels.
 */
export function createHttpLabels(
  service: string,
  method: string,
  route: string,
  status: number | string
): HttpMetricLabels {
  return {
    ...createDefaultLabels(service),
    method,
    route,
    status: String(status),
  };
}

/**
 * Kafka labels.
 */
export function createKafkaLabels(
  service: string,
  topic: string,
  event: string
): KafkaMetricLabels {
  return {
    ...createDefaultLabels(service),
    topic,
    event,
  };
}

/**
 * Database labels.
 */
export function createDatabaseLabels(
  service: string,
  operation: string,
  collection: string
): DatabaseMetricLabels {
  return {
    ...createDefaultLabels(service),
    operation,
    collection,
  };
}

/**
 * Business labels.
 */
export function createBusinessLabels(
  service: string,
  entity: string
): BusinessMetricLabels {
  return {
    ...createDefaultLabels(service),
    entity,
  };
}