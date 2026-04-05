import { createProxyMiddleware, Options } from 'http-proxy-middleware';

// Define targets for each microservice
const serviceTargets = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  catalog: process.env.CATALOG_SERVICE_URL || 'http://localhost:3002',
  cart: process.env.CART_SERVICE_URL || 'http://localhost:3003',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
};

// Generic proxy creator (using console instead of logger)
export const createServiceProxy = (serviceName: keyof typeof serviceTargets, pathRewriteFrom: string) => {
  const target = serviceTargets[serviceName];

  const options: Options = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^/api${pathRewriteFrom}`]: '',     // Remove /api prefix before forwarding
    },
    on: {
      proxyReq: (proxyReq, req) => {
        console.log(`🔀 Proxy → ${serviceName} | ${req.method} ${req.url} → ${target}`);
        
        if (req.headers.authorization) {
          proxyReq.setHeader('authorization', req.headers.authorization);
        }
      },
      proxyRes: (proxyRes, req) => {
        console.log(`← Response from ${serviceName} | Status: ${proxyRes.statusCode} | ${req.url}`);
      },
      error: (err, req, res) => {
        console.error(`❌ Proxy error to ${serviceName}:`, err.message);
        
        (res as any).status(502).json({
          error: 'Bad Gateway',
          message: `Service ${serviceName} is unavailable`,
        });
      },
    },
  };

  return createProxyMiddleware(options);
};