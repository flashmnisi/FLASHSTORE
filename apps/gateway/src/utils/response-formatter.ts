/**
 * Standardized response formatter for the gateway
 */
export const formatResponse = <T = any>(
  success: boolean,
  message: string,
  data?: T,
  meta?: Record<string, any>
) => {
  return {
    success,
    message,
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Success response helper
 */
export const successResponse = <T = any>(message: string, data?: T, meta?: Record<string, any>) => {
  return formatResponse(true, message, data, meta);
};

/**
 * Error response helper
 */
export const errorResponse = (message: string, statusCode = 400, details?: any) => {
  return {
    success: false,
    message,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
  };
};