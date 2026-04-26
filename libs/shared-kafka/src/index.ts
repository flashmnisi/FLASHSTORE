// ===============================
// CORE KAFKA CLIENT
// ===============================
export * from './client/kafka.client';
export * from './client/producer';
export * from './client/consumer';

// ===============================
// HIGH-LEVEL MESSAGING API (IMPORTANT)
// ===============================
//export * from './messaging/publish';
export * from './messaging/subscribe';

// ===============================
// RESILIENCE LAYER
// ===============================
export * from './retry/retry.handler';
export * from './retry/retry.consumer';
export * from './retry/retry.policy';

export * from './resilience/dlq/dlq.publisher';
export * from './resilience/dlq/dlq.consumer';

// ===============================
// IDENTITY + SAFETY
// ===============================
export * from './resilience/indempotency/idempotency.service';

// ===============================
// OBSERVABILITY UTILITIES
// ===============================
export * from './utils/header';
export * from './events/base-event';