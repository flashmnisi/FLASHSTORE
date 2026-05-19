// apps/gateway/src/infrastructure/proxy/service-proxy.ts

//import { Request, Response, NextFunction } from 'express';
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
};

export const createProxy = (serviceName: keyof typeof services) => {
  const target = services[serviceName];

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    timeout: 15000,
    proxyTimeout: 16000,

    on: {
      proxyReq: (proxyReq, req: any) => {
        // Re-attach body if it was parsed
        if (req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }

        if (req.user) {
          proxyReq.setHeader('x-user-id', req.user.userId || req.user.id);
        }

        if (req.correlationId || req.id) {
          proxyReq.setHeader('x-correlation-id', req.correlationId || req.id);
        }
      },

      proxyRes: (proxyRes, req) => {
        logger.info(`Proxy ${serviceName} ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`);
      },

      error: (err, req, res: any) => {
        logger.error(`Proxy error ${serviceName}`, { error: err.message, path: req.originalUrl });
        res.status(502).json({
          success: false,
          message: `${serviceName} is currently unavailable`,
          fallback: true,
        });
      },
    },
  });
};