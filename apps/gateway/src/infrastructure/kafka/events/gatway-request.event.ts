// apps/gateway/src/infrastructure/kafka/events/gateway-request.event.ts

import crypto from 'crypto';
import { EVENTS } from '../topics';
import { BaseEvent } from '../schemas/base-event.shema';

export interface GatewayRequestData {
  service: string;
  method: string;
  path: string;
  status: number;

  userId?: string;

  duration: number;
}

export const buildGatewayRequestEvent = (
  req: any,
  serviceName: string,
  status: number
): BaseEvent<GatewayRequestData> => {

  return {
    eventId: crypto.randomUUID(),

    event: EVENTS.REQUEST_PROXIED,

    data: {
      service: serviceName,
      method: req.method,
      path: req.originalUrl,
      status,

      userId:
        req.user?.userId ||
        req.user?.id,

      duration:
        Date.now() -
        (req.startTime || Date.now()),
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