export interface EventContext {
  event: any;
  topic: string;
  eventId: string;
  serviceName: string;

  // retry + resilience
  retryCount: number;
  maxRetries?: number;

  // observability
  correlationId?: string;
  traceId?: string;

  // timestamps
  receivedAt: number;

  headers?: Record<string, string>;
}
  

export type Next = () => Promise<void>;

export type EventMiddleware = (
  ctx: EventContext,
  next: Next
) => Promise<void>;
