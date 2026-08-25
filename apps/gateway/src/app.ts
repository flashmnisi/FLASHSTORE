// apps/gateway/src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import routes from './routes';

import { errorMiddleware }
  from './middlewares/error.middleware';

  import {
  metricsMiddleware,
  metricsRouter,
} from '@org/shared-metrics';

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json({
  limit: '50mb',
}));

app.use(express.urlencoded({
  extended: true,
  limit: '50mb',
}));

app.use(metricsMiddleware('gateway'));

app.use('/metrics', metricsRouter);

app.get('/health', (_req, res) => {
  return res.json({
    success: true,
    service: 'gateway',
    timestamp: new Date().toISOString(),
  });
});

app.use('/', routes);

app.use(errorMiddleware);

export default app;