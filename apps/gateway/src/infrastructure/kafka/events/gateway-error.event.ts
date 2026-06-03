// apps/gateway/src/infrastructure/kafka/events/gateway-error.event.ts

import crypto from 'crypto';
import { EVENTS } from '../topics';
import { BaseEvent } from '../schemas/base-event.shema';

export interface GatewayErrorData {
  service: string;
  path: string;
  method: string;

  error: string;

  status: number;
}

export const buildGatewayErrorEvent = (
  req: any,
  serviceName: string,
  error: any
): BaseEvent<GatewayErrorData> => {

  return {
    eventId: crypto.randomUUID(),

    event: EVENTS.GATEWAY_ERROR,

    data: {
      service: serviceName,

      path: req.originalUrl,

      method: req.method,

      error:
        error.message ||
        'Unknown Error',

      status:
        error.status ||
        502,
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