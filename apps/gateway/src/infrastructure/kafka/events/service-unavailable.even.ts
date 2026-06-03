// apps/gateway/src/infrastructure/kafka/events/service-unavailable.event.ts

import crypto from 'crypto';
import { EVENTS } from '../topics';
import { BaseEvent } from '../schemas/base-event.shema';

export interface ServiceUnavailableData {
  service: string;
  path: string;
  method: string;
}

export const buildServiceUnavailableEvent = (
  req: any,
  serviceName: string
): BaseEvent<ServiceUnavailableData> => {

  return {
    eventId: crypto.randomUUID(),

    event:
      EVENTS.SERVICE_UNAVAILABLE,

    data: {
      service: serviceName,

      path: req.originalUrl,

      method: req.method,
    },

    metadata: {
      source: 'api-gateway',

      timestamp:
        new Date().toISOString(),

      correlationId:
        req.correlationId || req.id,

      requestId:
        req.id,

      version: '1.0.0',
    },
  };

};