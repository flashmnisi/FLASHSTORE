/**
 * Common labels applied to every metric.
 */
export interface MetricLabels {
  service: string;
  environment: string;
  version: string;
}

/**
 * HTTP request metric labels.
 */
export interface HttpMetricLabels extends MetricLabels {
  method: string;
  route: string;
  status: string;
}

/**
 * Kafka metric labels.
 */
export interface KafkaMetricLabels extends MetricLabels {
  topic: string;
  event: string;
}

/**
 * Database metric labels.
 */
export interface DatabaseMetricLabels extends MetricLabels {
  operation: string;
  collection: string;
}

/**
 * Business metric labels.
 */
export interface BusinessMetricLabels extends MetricLabels {
  entity: string;
}

/**
 * Generic metric labels.
 */
export type Labels = Record<string, string>;