import { randomUUID } from 'node:crypto';

export const HEADER_KEYS = {
  REQUEST_ID: 'x-request-id',
  CORRELATION_ID: 'x-correlation-id',
  RETRY_COUNT: 'x-retry-count',
} as const;

export interface TraceHeaders {
  requestId: string;
  correlationId: string;
  retryCount: number;
}

export const extractHeaders = (
  headers: Record<string, any> = {}
): TraceHeaders => {
  return {
    requestId: String(headers[HEADER_KEYS.REQUEST_ID] || randomUUID()),
    correlationId: String(headers[HEADER_KEYS.CORRELATION_ID] || randomUUID()),
    retryCount: Number(headers[HEADER_KEYS.RETRY_COUNT] || 0),
  };
};

export const buildHeaders = (
  headers: Partial<TraceHeaders> = {}
): Record<string, string> => {
  return {
    [HEADER_KEYS.REQUEST_ID]: headers.requestId || randomUUID(),
    [HEADER_KEYS.CORRELATION_ID]: headers.correlationId || randomUUID(),
    [HEADER_KEYS.RETRY_COUNT]: String(headers.retryCount ?? 0),
  };
};

export const forwardHeaders = (
  headers: Record<string, any> = {}
): Record<string, string> => {
  return {
    [HEADER_KEYS.REQUEST_ID]: String(
      headers[HEADER_KEYS.REQUEST_ID] || randomUUID()
    ),
    [HEADER_KEYS.CORRELATION_ID]: String(
      headers[HEADER_KEYS.CORRELATION_ID] || randomUUID()
    ),
  };
};