import { randomUUID } from "crypto";
import { EventMiddleware } from "../middleware";

export const tracingMiddleware: EventMiddleware = async (ctx, next) => {
  const headers = ctx.headers || {};
  const event = ctx.event || {};

  // Correlation ID (cross-service request tracking)
  const correlationId =
    headers["x-correlation-id"] ||
    event?.metadata?.correlationId ||
    ctx.correlationId ||
    randomUUID();

  // Trace ID (pipeline trace per event flow)
  const traceId =
    headers["x-trace-id"] ||
    event?.metadata?.traceId ||
    ctx.traceId ||
    randomUUID();

  // Event ID (idempotency key — MUST be stable)
  const eventId =
    ctx.eventId ||
    event?.metadata?.eventId ||
    randomUUID();

  // Attach to context
  ctx.correlationId = correlationId;
  ctx.traceId = traceId;
  ctx.eventId = eventId;

  // Normalize enriched event
  ctx.event = {
    ...event,
    metadata: {
      ...event.metadata,
      correlationId,
      traceId,
      eventId,
    },
  };

  await next();
};