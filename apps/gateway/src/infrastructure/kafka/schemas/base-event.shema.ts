// apps/gateway/src/infrastructure/kafka/schemas/base-event.schema.ts

export interface BaseEvent<T = any> {
  eventId: string;
  event: string;

  data: T;

  metadata: {
    source: string;
    timestamp: string;

    correlationId?: string;
    requestId?: string;

    version: string;
  };
}