import { createProxyMiddleware } from 'http-proxy-middleware';
import logger from '@org/shared-logger';

const services = {
  user: 'http://user-service:3001',
  catalog: 'http://catalog-service:3002',
  cart: 'http://cart-service:3003',
  order: 'http://order-service:3004',
  payment: 'http://payment-service:3005',
  analytics: 'http://analytics-service:3006',
  search: 'http://search-service:4005',
  notification: 'http://notification-service:3007',
  inventory:'http://notification-service:3008',
};

export const createProxy = (
  serviceName: keyof typeof services
) => {

  const target = services[serviceName];

  return createProxyMiddleware({

    target,

    changeOrigin: true,

    xfwd: true,

    timeout: 15000,

    proxyTimeout: 16000,

    pathRewrite: (_path, req: any) => {
      return req.originalUrl;
    },

    on: {

      proxyReq: (proxyReq, req: any) => {

        logger.info('🌍 Gateway Request', {
          service: serviceName,
          method: req.method,
          path: req.originalUrl,
          requestId: req.id || req.correlationId,
        });

        if (
          req.body &&
          Object.keys(req.body).length > 0
        ) {

          const bodyData =
            JSON.stringify(req.body);

          proxyReq.setHeader(
            'Content-Type',
            'application/json'
          );

          proxyReq.setHeader(
            'Content-Length',
            Buffer.byteLength(bodyData)
          );

          proxyReq.write(bodyData);
        }

        if (req.user?.userId || req.user?.id) {
          proxyReq.setHeader(
            'x-user-id',
            req.user.userId || req.user.id
          );
        }

        if (req.user?.role) {
          proxyReq.setHeader(
            'x-user-role',
            req.user.role
          );
        }

        if (req.correlationId || req.id) {
          proxyReq.setHeader(
            'x-correlation-id',
            req.correlationId || req.id
          );
        }
      },

      proxyRes: (proxyRes, req: any) => {

        logger.info(
          `✅ Proxy ${serviceName} ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`
        );

      },

      error: (
        err,
        req: any,
        res: any
      ) => {

        logger.error(
          `❌ Proxy error ${serviceName}`,
          {
            error: err.message,
            path: req.originalUrl,
          }
        );

        if (!res.headersSent) {

          res.status(502).json({
            success: false,
            message: `${serviceName} is currently unavailable`,
            fallback: true,
          });

        }

      },

    },

  });

};