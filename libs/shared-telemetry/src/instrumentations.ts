import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

export function createTelemetryInstrumentations() {
  return [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },

      '@opentelemetry/instrumentation-http': {
        enabled: true,
      },

      '@opentelemetry/instrumentation-express': {
        enabled: true,
      },

      '@opentelemetry/instrumentation-mongodb': {
        enabled: true,
      },

      '@opentelemetry/instrumentation-pg': {
        enabled: true,
      },
    }),
  ];
}