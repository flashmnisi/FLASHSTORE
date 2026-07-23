// libs/shared-metrics/src/index.ts

export * from './lib/shared-metrics.js';
// ======================================================
// Registry
// ======================================================

export * from './registry';

// ======================================================
// HTTP Middleware
// ======================================================

export * from './middleware/metrics.middleware';
export * from './middleware/metrics.route';

// ======================================================
// Infrastructure Metrics
// ======================================================

export * from './metrics/counters';
export * from './metrics/gauges';
export * from './metrics/histograms';

// ======================================================
// Business Metrics
// ======================================================

export * from './metrics/business';

// ======================================================
// Kafka Metrics
// ======================================================

export * from './metrics/kafka';

// ======================================================
// MongoDB Metrics
// ======================================================

export * from './metrics/mongodb';

// ======================================================
// Utilities
// ======================================================

export * from './utils/labels';

// ======================================================
// Types
// ======================================================

export * from './types/metrics.types';