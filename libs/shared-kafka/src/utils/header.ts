import { v4 as uuidv4 } from 'uuid';

export const HEADER_KEYS = {
  REQUEST_ID: 'x-request-id',
  CORRELATION_ID: 'x-correlation-id',
  RETRY_COUNT: 'x-retry-count',
};

/**
 * Extract tracing headers
 */
export const extractHeaders = (headers: any) => {
  return {
    requestId: headers[HEADER_KEYS.REQUEST_ID],
    correlationId: headers[HEADER_KEYS.CORRELATION_ID],
    retryCount: headers[HEADER_KEYS.RETRY_COUNT] || '0',
  };
};

/**
 * Build headers for Kafka message
 */
export const buildHeaders = (headers: any = {}) => {
  return {
    [HEADER_KEYS.REQUEST_ID]: headers.requestId || uuidv4(),
    [HEADER_KEYS.CORRELATION_ID]: headers.correlationId || uuidv4(),
    [HEADER_KEYS.RETRY_COUNT]: headers.retryCount || '0',
  };
};

/**
 * Forward headers (Gateway → Services)
 */
export const forwardHeaders = (headers: any) => {
  return {
    [HEADER_KEYS.REQUEST_ID]: headers[HEADER_KEYS.REQUEST_ID] || uuidv4(),
    [HEADER_KEYS.CORRELATION_ID]: headers[HEADER_KEYS.CORRELATION_ID] || uuidv4(),
  };
};