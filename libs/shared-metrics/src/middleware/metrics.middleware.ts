import { Request, Response, NextFunction } from 'express';

import {
  httpRequestsTotal,
  httpErrorsTotal,
} from '../metrics/counters';

import { httpRequestDuration } from '../metrics/histograms';

/**
 * Creates Prometheus middleware for an Express service.
 *
 * Example:
 *
 * app.use(metricsMiddleware('user-service'));
 */
export function metricsMiddleware(service: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();

    res.on('finish', () => {
      const route =
        req.route?.path ??
        req.baseUrl ??
        req.path ??
        'unknown';

      const status = String(res.statusCode);

      const labels = {
        service,
        method: req.method,
        route,
        status,
      };

      // Count every request
      httpRequestsTotal.inc(labels);

      // Count errors
      if (res.statusCode >= 400) {
        httpErrorsTotal.inc(labels);
      }

      // Request duration
      const [seconds, nanoseconds] = process.hrtime(start);

      const duration =
        seconds + nanoseconds / 1_000_000_000;

      httpRequestDuration.observe(labels, duration);
    });

    next();
  };
}