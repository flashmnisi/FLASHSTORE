import { IncomingHttpHeaders } from 'http';

/**
 * Utility to forward important headers from client → downstream services
 */
export const forwardHeaders = (reqHeaders: IncomingHttpHeaders): Record<string, string> => {
  const forwarded: Record<string, string> = {};

  // Always forward these standard headers
  const importantHeaders = [
    'authorization',
    'x-correlation-id',
    'x-user-id',
    'x-user-role',
    'x-forwarded-for',
    'x-forwarded-proto',
    'user-agent',
    'accept',
    'content-type',
  ];

  for (const header of importantHeaders) {
    const value = reqHeaders[header];
    if (value) {
      forwarded[header] = Array.isArray(value) ? value.join(', ') : String(value);
    }
  }

  return forwarded;
};

/**
 * Clean headers before sending to backend services
 * Removes hop-by-hop headers that should not be forwarded
 */
export const sanitizeHeaders = (headers: IncomingHttpHeaders): Record<string, string> => {
  const sanitized: Record<string, string> = {};
  const hopByHopHeaders = [
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailers',
    'transfer-encoding',
    'upgrade',
  ];

  for (const [key, value] of Object.entries(headers)) {
    if (!hopByHopHeaders.includes(key.toLowerCase()) && value !== undefined) {
      sanitized[key] = Array.isArray(value) ? value.join(', ') : String(value);
    }
  }

  return sanitized;
};