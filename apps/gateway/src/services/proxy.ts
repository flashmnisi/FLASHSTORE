import { createProxyMiddleware } from 'http-proxy-middleware';
import logger from '@org/shared-logger';

const serviceTargets = {
  user: 'http://user-service:3001',
  catalog: 'http://catalog-service:3002',
  cart: 'http://cart-service:3003',
  order: 'http://order-service:3004',
  payment: 'http://payment-service:3005',
  notification: 'http://notification-service:3006',
};

export const createServiceProxy = (serviceName: keyof typeof serviceTargets) => {
  const target = serviceTargets[serviceName];

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    timeout: 180000,
    proxyTimeout: 180000,

    // Remove /api completely so user-service sees /register, /login, etc.
    pathRewrite: {
      '^/api': '',
    },

    on: {
      proxyReq: (proxyReq, req: any) => {
        logger.info(`🔀 Proxy → ${serviceName} | ${req.method} ${req.url}`);

        if (req.body) {
          const bodyStr = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyStr));
          proxyReq.write(bodyStr);
        }
      },

      proxyRes: (proxyRes, req) => {
        logger.info(`Response ← ${serviceName} | ${proxyRes.statusCode}`);
      },

      error: (err, req, res: any) => {
        logger.error(`Proxy error to ${serviceName}: ${err.message}`);
        res.status(502).json({ success: false, message: `Cannot reach ${serviceName}` });
      },
    },
  });
};
// import logger from '@org/shared-logger';
// import { createProxyMiddleware } from 'http-proxy-middleware';

// const services = {
//   user: 'http://user-service:3001',
//   order: 'http://order-service:3004',
//   payment: 'http://payment-service:3005',
//   cart: 'http://cart-service:3003',
//   catalog: 'http://catalog-service:3002',
//   notification: 'http://notification-service:3006',
// };

// export const createServiceProxy = (service: keyof typeof services) => {
//   return createProxyMiddleware({
//     target: services[service],
//     changeOrigin: true,

//     pathRewrite: {
//       [`^/api/${service}`]: '',
//     },

//     on: {
//       proxyReq: (proxyReq, req: any) => {
//         logger.info(`🔀 ${req.method} → ${service} ${req.url}`);

//         if (req.body) {
//           const body = JSON.stringify(req.body);
//           proxyReq.setHeader('Content-Type', 'application/json');
//           proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
//           proxyReq.write(body);
//         }
//       },

//       proxyRes: (proxyRes, req) => {
//         logger.info(`✅ ${service} responded ${proxyRes.statusCode}`);
//       },

//       error: (err, req, res: any) => {
//         logger.error(`❌ Proxy error ${service}: ${err.message}`);
//         res.status(502).json({
//           success: false,
//           message: `${service} service unavailable`,
//           error: err.message,
//         });
//       },
//     },
//   });
// };

// apps/gateway/src/services/proxy.service.ts
// import { createProxyMiddleware, Options } from 'http-proxy-middleware';
// import logger from '@org/shared-logger';

// const serviceTargets: Record<string, string> = {
//   user: 'http://user-service:3001',
//   catalog: 'http://catalog-service:3002',
//   cart: 'http://cart-service:3003',
//   order: 'http://order-service:3004',
//   payment: 'http://payment-service:3005',
//   notification: 'http://notification-service:3006',
// };

// export const createServiceProxy = (serviceName: keyof typeof serviceTargets, pathRewriteFrom: string) => {
//   const target = serviceTargets[serviceName];

//   const options: Options = {
//     target,
//     changeOrigin: true,
//     pathRewrite: {
//       [`^/api${pathRewriteFrom}`]: '',
//     },
//     proxyTimeout: 120000,
//     timeout: 120000,

//     on: {
//       proxyReq: (proxyReq, req) => {
//         logger.info(`🔀 Proxy → ${serviceName} | ${req.method} ${req.url}`);

//         // Safely forward body if it exists (fixes TS2339)
//         if ((req as any).body) {
//           const bodyData = JSON.stringify((req as any).body);
//           proxyReq.setHeader('Content-Type', 'application/json');
//           proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
//           proxyReq.write(bodyData);
//         }
//       },

//       proxyRes: (proxyRes, req) => {
//         logger.info(`Response ← ${serviceName} | ${proxyRes.statusCode} ${req.url}`);
//       },

//       error: (err, req, res) => {
//         logger.error(`❌ Proxy error to ${serviceName}: ${err.message}`);
//         (res as any).status(502).json({
//           success: false,
//           message: `Service ${serviceName} is unavailable`,
//           error: err.message,
//         });
//       },
//     },
//   };

//   return createProxyMiddleware(options);
// };


// // apps/gateway/src/services/proxy.service.ts
// import { createProxyMiddleware } from 'http-proxy-middleware';
// import logger from '@org/shared-logger';

// export const createServiceProxy = (serviceName: string, pathRewriteFrom: string) => {
//   return createProxyMiddleware({
//     target: 'http://user-service:3001',
//     changeOrigin: true,
//     pathRewrite: { [`^/api${pathRewriteFrom}`]: '' },

//     proxyTimeout: 120000,
//     timeout: 120000,

//     on: {
//       proxyReq: (proxyReq, req) => {
//         logger.info(`Forwarding ${req.method} ${req.url} → user-service`);

//         // Ensure body headers are correctly passed
//         if (req.headers['content-type']) {
//           proxyReq.setHeader('content-type', req.headers['content-type']);
//         }
//         if (req.headers['content-length']) {
//           proxyReq.setHeader('content-length', req.headers['content-length']);
//         }
//       },
//       proxyRes: (proxyRes) => {
//         logger.info(`Received response from user-service: ${proxyRes.statusCode}`);
//       },
//       error: (err, req, res) => {
//         logger.error(`Proxy error: ${err.message}`);
//         (res as any).status(502).json({ 
//           success: false, 
//           message: 'Cannot reach user-service' 
//         });
//       }
//     }
//   });
// };

// // apps/gateway/src/services/proxy.service.ts
// import { createProxyMiddleware, Options } from 'http-proxy-middleware';
// import logger from '@org/shared-logger';

// const serviceTargets = {
//   user: 'http://user-service:3001',
//   catalog: 'http://catalog-service:3002',
//   cart: 'http://cart-service:3003',
//   order: 'http://order-service:3004',
//   payment: 'http://payment-service:3005',
//   notification: 'http://notification-service:3006',
// };

// export const createServiceProxy = (serviceName: keyof typeof serviceTargets, pathRewriteFrom: string) => {
//   const target = serviceTargets[serviceName];

//   const options: Options = {
//     target,
//     changeOrigin: true,
//     pathRewrite: { [`^/api${pathRewriteFrom}`]: '' },

//     // Critical for POST requests with body
//     proxyTimeout: 60000,
//     timeout: 60000,
//     xfwd: true,
//     preserveHeaderKeyCase: true,

//     on: {
//       proxyReq: (proxyReq, req) => {
//         logger.info(`Proxy → ${serviceName} | ${req.method} ${req.url}`);

//         // Ensure body is forwarded correctly
//         if (req.headers['content-type']) {
//           proxyReq.setHeader('content-type', req.headers['content-type']);
//         }
//         if (req.headers['content-length']) {
//           proxyReq.setHeader('content-length', req.headers['content-length']);
//         }
//         if (req.headers.authorization) {
//           proxyReq.setHeader('authorization', req.headers.authorization);
//         }
//       },
//       proxyRes: (proxyRes, req) => {
//         logger.info(`Response ← ${serviceName} | ${proxyRes.statusCode}`);
//       },
//       error: (err, req, res) => {
//         logger.error(`Proxy error to ${serviceName}: ${err.message}`);
//         (res as any).status(502).json({
//           success: false,
//           message: `Service ${serviceName} is unavailable`,
//         });
//       },
//     },
//   };

//   return createProxyMiddleware(options);
// };
// import { createProxyMiddleware, Options } from 'http-proxy-middleware';
// import logger from '@org/shared-logger';

// const serviceTargets = {
//   user: 'http://user-service:3001',
//   catalog: 'http://catalog-service:3002',
//   cart: 'http://cart-service:3003',
//   order: 'http://order-service:3004',
//   payment: 'http://payment-service:3005',
//   notification: 'http://notification-service:3006',
// };

// export const createServiceProxy = (serviceName: keyof typeof serviceTargets, pathRewriteFrom: string) => {
//   const target = serviceTargets[serviceName];

//   const options: Options = {
//     target,
//     changeOrigin: true,
//     pathRewrite: {
//       [`^/api${pathRewriteFrom}`]: '',
//     },
//     on: {
//       proxyReq: (proxyReq, req) => {
//         logger.info(
//           { method: req.method, url: req.url, target: serviceName },
//           `Proxy → ${serviceName}`
//         );

//         if (req.headers.authorization) {
//           proxyReq.setHeader('authorization', req.headers.authorization);
//         }
//       },
//       proxyRes: (proxyRes, req) => {
//         logger.info(
//           { status: proxyRes.statusCode, url: req.url },
//           `Response ← ${serviceName}`
//         );
//       },
//       error: (err, req, res) => {
//         logger.error(
//           { error: err.message, service: serviceName, url: req.url },
//           'Proxy error'
//         );

//         (res as any).status(502).json({
//           success: false,
//           message: `Service ${serviceName} is unavailable or timed out`,
//         });
//       },
//     },
//   };

//   return createProxyMiddleware(options);
// };