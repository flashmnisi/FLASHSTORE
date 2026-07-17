// apps/gateway/src/infrastructure/proxy/proxy.factory.ts

import { createProxyMiddleware } from 'http-proxy-middleware';

import crypto from 'crypto';

import logger from '@org/shared-logger';

import { withCircuitBreaker, retry } from '@org/shared-resilience';

import { services } from '../../config/services';

import { forwardHeaders } from '../../utils/header-utils';

import { gatewayProducer } from '../kafka/producer';

export const createServiceProxy = (serviceName: keyof typeof services) => {
  const target = services[serviceName];

  /**
   * =====================================
   * HEALTH CHECK THROUGH CIRCUIT BREAKER
   * =====================================
   */
  const guardedHealthCheck = withCircuitBreaker(
    async () => true,
    serviceName,
    'proxy-health-check',
    {
      timeout: 10000,
      errorThresholdPercentage: 50,
      resetTimeout: 15000,
    }
  );

  /**
   * =====================================
   * PROXY INSTANCE
   * =====================================
   */
  const proxy = createProxyMiddleware({
    target,

    changeOrigin: true,

    xfwd: true,

    proxyTimeout: 10000,

    timeout: 10000,

    /**
     * Preserve original URL
     */
    pathRewrite: (_path, req: any) => {
      return req.originalUrl;
    },

    on: {
      /**
       * =====================================
       * BEFORE PROXY REQUEST
       * =====================================
       */
      proxyReq: (proxyReq, req: any) => {
        try {
          const forwardedHeaders = forwardHeaders(req.headers);

          /**
           * Forward headers
           */
          Object.entries(forwardedHeaders).forEach(([key, value]) => {
            if (value && !proxyReq.headersSent) {
              proxyReq.setHeader(key, value as string);
            }
          });

          /**
           * Inject user context
           */
          if (req.user?.userId && !proxyReq.headersSent) {
            proxyReq.setHeader('x-user-id', req.user.userId);
          }

          if (req.user?.role && !proxyReq.headersSent) {
            proxyReq.setHeader('x-user-role', req.user.role);
          }

          /**
           * Correlation IDs
           */
          if (req.id && !proxyReq.headersSent) {
            proxyReq.setHeader('x-request-id', req.id);

            proxyReq.setHeader('x-correlation-id', req.id);
          }

          /**
           * Re-send body if parsed
           */
          if (req.body && Object.keys(req.body).length > 0) {
            const bodyData = JSON.stringify(req.body);

            proxyReq.setHeader('Content-Type', 'application/json');

            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));

            proxyReq.write(bodyData);
          }
        } catch (error: any) {
          logger.error('❌ Proxy request preparation failed', {
            service: serviceName,
            requestId: req.id,
            error: error.message,
          });

          throw error;
        }
      },

      /**
       * =====================================
       * PROXY RESPONSE
       * =====================================
       */
      proxyRes: async (proxyRes, req: any) => {
        const status = proxyRes.statusCode || 500;

        const duration = Date.now() - (req.startTime || Date.now());

        logger.info('✅ Service response received', {
          service: serviceName,
          method: req.method,
          path: req.originalUrl,
          status,
          duration,
          requestId: req.id,
        });

        /**
         * Publish analytics event
         */
        try {
          await gatewayProducer.publishRequestEvent(req, serviceName, status);
        } catch (error: any) {
          logger.error('❌ Failed to publish analytics event', {
            service: serviceName,
            error: error.message,
          });
        }
      },

      /**
       * =====================================
       * PROXY ERROR
       * =====================================
       */
      error: async (err, req: any, res: any) => {
        logger.error('❌ Proxy request failed', {
          service: serviceName,
          method: req.method,
          path: req.originalUrl,
          requestId: req.id,
          error: err.message,
        });

        /**
         * Publish failure analytics
         */
        try {
  await gatewayProducer.publishErrorEvent(req, serviceName, err);
} catch (publishError) {
  logger.warn('Failed to publish gateway error event',
    { error: publishError }
  );
}

        if (!res.headersSent) {
          return res.status(502).json({
            success: false,
            service: serviceName,
            requestId: req.id,
            message: 'Bad Gateway',
          });
        }
      },
    },
  });

  /**
   * =====================================
   * GATEWAY HANDLER
   * =====================================
   */
  return async (req: any, res: any, next: any) => {
    /**
     * Request metadata
     */
    req.id = req.id || crypto.randomUUID();

    req.startTime = Date.now();

    try {
      logger.info('🌍 Incoming gateway request', {
        service: serviceName,
        method: req.method,
        path: req.originalUrl,
        requestId: req.id,
      });

      /**
       * =====================================
       * CIRCUIT BREAKER + RETRY
       * =====================================
       */
      await retry(
        async () => {
          return await guardedHealthCheck();
        },

        {
          retries: 2,
          baseDelay: 500,
          maxDelay: 3000,
          serviceName,
          requestId: req.id,
        }
      );

      /**
       * =====================================
       * FORWARD TO SERVICE
       * =====================================
       */
      return proxy(req, res, next);
    } catch (error: any) {
      logger.error('❌ Service unavailable', {
        service: serviceName,
        requestId: req.id,
        error: error.message,
      });

      if (!res.headersSent) {
        return res.status(503).json({
          success: false,
          service: serviceName,
          requestId: req.id,
          fallback: true,
          message: `${serviceName} service unavailable`,
        });
      }
    }
  };
};
