import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

import {
  createTelemetryResource,
  type TelemetryResourceOptions,
} from './resource';

import { createTelemetryInstrumentations } from './instrumentations';

let sdk: NodeSDK | undefined;
let initialized = false;

export interface SetupTelemetryOptions extends TelemetryResourceOptions {
  otlpEndpoint?: string;
}

export function setupTelemetry(
  options: SetupTelemetryOptions,
): NodeSDK {
  if (initialized && sdk) {
    return sdk;
  }

  const base =
    options.otlpEndpoint ??
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
    'http://otel-collector.monitoring.svc.cluster.local:4318';

  const url = base.endsWith('/v1/traces')
    ? base
    : `${base.replace(/\/$/, '')}/v1/traces`;

  const exporter = new OTLPTraceExporter({
    url,
  });

  sdk = new NodeSDK({
    resource: createTelemetryResource(options),

    spanProcessors: [
      new BatchSpanProcessor(exporter, {
        maxQueueSize: 2048,
        maxExportBatchSize: 512,
        scheduledDelayMillis: 5000,
        exportTimeoutMillis: 30000,
      }),
    ],

    textMapPropagator: new W3CTraceContextPropagator(),

    instrumentations: createTelemetryInstrumentations(),
  });

  sdk.start();

  initialized = true;

  return sdk;
}

export async function shutdownTelemetry(): Promise<void> {
  if (!sdk) {
    return;
  }

  try {
    await sdk.shutdown();
  } finally {
    sdk = undefined;
    initialized = false;
  }
}