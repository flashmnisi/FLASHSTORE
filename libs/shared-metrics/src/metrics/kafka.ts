// libs/shared-metrics/src/metrics/kafka.ts

import { Counter, Gauge, Histogram } from 'prom-client';
import { register } from '../registry';

/**
 * Kafka messages produced.
 */
export const kafkaMessagesSentTotal = new Counter({
  name: 'flashstore_kafka_messages_sent_total',
  help: 'Kafka messages produced',
  labelNames: ['service', 'topic', 'event'],
  registers: [register],
});

/**
 * Kafka messages consumed.
 */
export const kafkaMessagesReceivedTotal = new Counter({
  name: 'flashstore_kafka_messages_received_total',
  help: 'Kafka messages consumed',
  labelNames: ['service', 'topic', 'event'],
  registers: [register],
});

/**
 * Kafka message failures.
 */
export const kafkaMessageFailuresTotal = new Counter({
  name: 'flashstore_kafka_message_failures_total',
  help: 'Kafka message processing failures',
  labelNames: ['service', 'topic', 'event'],
  registers: [register],
});

/**
 * Kafka retry attempts.
 */
export const kafkaRetriesTotal = new Counter({
  name: 'flashstore_kafka_retries_total',
  help: 'Kafka retry attempts',
  labelNames: ['service', 'topic'],
  registers: [register],
});

/**
 * Dead Letter Queue events.
 */
export const kafkaDlqTotal = new Counter({
  name: 'flashstore_kafka_dlq_total',
  help: 'Messages sent to the Dead Letter Queue',
  labelNames: ['service', 'topic'],
  registers: [register],
});

/**
 * Current consumer lag.
 */
export const kafkaConsumerLag = new Gauge({
  name: 'flashstore_kafka_consumer_lag',
  help: 'Current Kafka consumer lag',
  labelNames: ['service', 'topic', 'partition'],
  registers: [register],
});

/**
 * Connected brokers.
 */
export const kafkaConnectedBrokers = new Gauge({
  name: 'flashstore_kafka_connected_brokers',
  help: 'Number of connected Kafka brokers',
  labelNames: ['service'],
  registers: [register],
});

/**
 * Kafka message processing duration.
 */
export const kafkaProcessingDuration = new Histogram({
  name: 'flashstore_kafka_processing_duration_seconds',
  help: 'Kafka message processing duration',
  labelNames: ['service', 'topic', 'event'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

/**
 * Kafka producer publish duration.
 */
export const kafkaProduceDuration = new Histogram({
  name: 'flashstore_kafka_produce_duration_seconds',
  help: 'Kafka producer publish duration',
  labelNames: ['service', 'topic'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1],
  registers: [register],
});

/**
 * Kafka batch size.
 */
export const kafkaBatchSize = new Histogram({
  name: 'flashstore_kafka_batch_size',
  help: 'Kafka producer batch size',
  labelNames: ['service', 'topic'],
  buckets: [1, 5, 10, 25, 50, 100, 250],
  registers: [register],
});