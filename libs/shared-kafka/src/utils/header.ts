import { v4 as uuidv4 } from 'uuid';

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

/**
 * Normalize headers from incoming request/Kafka message
 */
export const extractHeaders = (headers: Record<string, any> = {}): TraceHeaders => {
  return {
    requestId: String(headers[HEADER_KEYS.REQUEST_ID] || uuidv4()),
    correlationId: String(headers[HEADER_KEYS.CORRELATION_ID] || uuidv4()),
    retryCount: Number(headers[HEADER_KEYS.RETRY_COUNT] || 0),
  };
};

/**
 * Build headers for Kafka publishing
 */
export const buildHeaders = (headers: Partial<TraceHeaders> = {}): Record<string, string> => {
  return {
    [HEADER_KEYS.REQUEST_ID]: headers.requestId || uuidv4(),
    [HEADER_KEYS.CORRELATION_ID]: headers.correlationId || uuidv4(),
    [HEADER_KEYS.RETRY_COUNT]: String(headers.retryCount ?? 0),
  };
};

/**
 * Forward headers from gateway → services
 */
export const forwardHeaders = (headers: Record<string, any> = {}): Record<string, string> => {
  return {
    [HEADER_KEYS.REQUEST_ID]: String(headers[HEADER_KEYS.REQUEST_ID] || uuidv4()),
    [HEADER_KEYS.CORRELATION_ID]: String(headers[HEADER_KEYS.CORRELATION_ID] || uuidv4()),
  };
};