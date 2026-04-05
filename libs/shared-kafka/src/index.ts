import { createConsumer, runConsumer } from './consumer.js';
import { getProducer, publish } from './producer.js';

// Main barrel export file
export * from './types.js';
export * from './kafka.js';
export * from './producer.js';
export * from './consumer.js';

// Re-export specific functions for convenience (default + named)
export { publish } from './producer.js';
export { getProducer } from './producer.js';
export { createConsumer, runConsumer } from './consumer.js';

// Default export for easy import (like before)
export default {
  publish,
  getProducer,
  createConsumer,
  runConsumer,
};
