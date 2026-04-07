import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import logger from '@org/shared-logger';

const serviceTargets = {
  user: process.env.USER_SERVICE_URL || 'http://user-service:3001',
  catalog: process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002',
  cart: process.env.CART_SERVICE_URL || 'http://cart-service:3003',
  order: process.env.ORDER_SERVICE_URL || 'http://order-service:3004',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3005',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3006',
};

export const createServiceProxy = (serviceName: keyof typeof serviceTargets, pathRewriteFrom: string) => {
  const target = serviceTargets[serviceName];

  const options: Options = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^/api${pathRewriteFrom}`]: '',
    },
    on: {
      proxyReq: (proxyReq, req) => {
        logger.info(
          { method: req.method, url: req.url, target },
          `Proxy → ${serviceName}`
        );

        if (req.headers.authorization) {
          proxyReq.setHeader('authorization', req.headers.authorization);
        }
      },
      proxyRes: (proxyRes, req) => {
        logger.info(
          { status: proxyRes.statusCode, url: req.url },
          `Response ← ${serviceName}`
        );
      },
      error: (err, req, res) => {
        logger.error(
          { error: err.message, service: serviceName },
          'Proxy error'
        );

        (res as any).status(502).json({
          error: 'Bad Gateway',
          message: `Service ${serviceName} is unavailable`,
        });
      },
    },
  };

  return createProxyMiddleware(options);
};