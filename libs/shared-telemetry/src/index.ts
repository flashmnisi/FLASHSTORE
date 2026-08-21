export * from './lib/shared-telemetry.js';
export {
  setupTelemetry,
  shutdownTelemetry,
} from './setup';

export type {
  SetupTelemetryOptions,
} from './setup';

export {
  createTelemetryResource,
} from './resource';

export type {
  TelemetryResourceOptions,
} from './resource';