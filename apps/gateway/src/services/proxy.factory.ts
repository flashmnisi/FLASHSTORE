// import { createProxyMiddleware } from 'http-proxy-middleware';
// import logger from '@org/shared-logger';
// import { services } from '../config/services';
// import { pathRewriteMap } from './path-rewrite';
// import { createCircuitBreaker } from '../resilience/circuit-breaker';
// import { retry } from '../resilience/retry';
// import { forwardHeaders } from '../utils/header-utils';

// export const createServiceProxy = (serviceName: keyof typeof services) => {
//   const target = services[serviceName];

//   const baseProxy = createProxyMiddleware({
//     target,
//     changeOrigin: true,
//     timeout: 15000,
//     proxyTimeout: 15000,

//     pathRewrite: {
//       [pathRewriteMap[serviceName]]: '',
//     },

//     on: {
//       proxyReq: (proxyReq, req: any) => {
//         // 🔥 Forward headers
//         const forwarded = forwardHeaders(req.headers);
//         Object.entries(forwarded).forEach(([key, value]) => {
//           proxyReq.setHeader(key, value as string);
//         });

//         // 🔐 User context
//         if (req.user) {
//           proxyReq.setHeader('x-user-id', req.user.userId);
//           proxyReq.setHeader('x-user-role', req.user.role);
//         }

//         // 🔥 CORRELATION FIX
//         proxyReq.setHeader('x-request-id', req.id);

//         // 📦 Forward body (for POST/PUT)
//         if (req.body && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
//           const bodyStr = JSON.stringify(req.body);
//           proxyReq.setHeader('Content-Type', 'application/json');
//           proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyStr));
//           proxyReq.write(bodyStr);
//         }

//         // 🔍 Log outgoing request
//         logger.info({
//           message: 'Proxying request',
//           service: serviceName,
//           target,
//           path: req.originalUrl,
//           method: req.method,
//           requestId: req.id,
//         });
//       },

//       proxyRes: (proxyRes, req: any) => {
//         logger.info({
//           message: 'Received response from service',
//           service: serviceName,
//           status: proxyRes.statusCode,
//           requestId: req.id,
//         });
//       },

//       error: (err, req: any, res) => {
//         logger.error({
//           message: 'Proxy error',
//           service: serviceName,
//           error: err.message,
//           requestId: req.id,
//         });

//         res.status(502).json({
//           success: false,
//           message: 'Bad Gateway',
//           service: serviceName,
//           requestId: req.id,
//         });
//       },
//     },
//   });

//   // 🔥 Circuit breaker
//   const breaker = createCircuitBreaker(
//     (req: any, res: any) =>
//       new Promise((resolve, reject) => {
//         baseProxy(req, res, (err: any) => {
//           if (err) reject(err);
//           else resolve(true);
//         });
//       }),
//     serviceName
//   );

//   // 🔁 Retry wrapper
//   return async (req: any, res: any, next: any) => {
//     try {
//       await retry(
//         async () => {
//           logger.warn({
//             message: 'Retrying request',
//             service: serviceName,
//             requestId: req.id,
//           });

//           return breaker.fire(req, res);
//         },
//         2,
//         400
//       );
//     } catch (error: any) {
//       logger.error({
//         message: 'Service failed after retries',
//         service: serviceName,
//         error: error.message,
//         requestId: req.id,
//       });

//       res.status(503).json({
//         success: false,
//         message: `${serviceName} service is temporarily unavailable`,
//         requestId: req.id,
//       });
//     }
//   };
// };