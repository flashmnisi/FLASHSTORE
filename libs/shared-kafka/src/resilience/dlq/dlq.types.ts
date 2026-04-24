export interface DLQEvent {
  topic: string;                 // original topic
  dlqTopic?: string;            // derived DLQ topic

  eventId: string;              // unique event identity
  originalEvent: any;           // full payload

  error: {
    message: string;
    stack?: string;
    name?: string;
  };

  retryCount: number;

  serviceName: string;

  timestamp: string;

  // 🔥 tracing (VERY IMPORTANT)
  correlationId?: string;
  traceId?: string;

  // 🔥 transport context
  headers?: Record<string, string>;

  // 🔥 observability upgrade
  failedAt?: string;
  failureStage?: 'handler' | 'middleware' | 'retry' | 'consumer';

  // 🔥 future-proof extension
  metadata?: Record<string, any>;
}