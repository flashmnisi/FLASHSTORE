import { Router } from 'express';

import { register, contentType } from '../registry';

const router = Router();

/**
 * Prometheus metrics endpoint.
 *
 * GET /metrics
 */
router.get('/metrics', async (_req, res) => {
  try {
    res.setHeader('Content-Type', contentType);

    res.end(await register.metrics());
  } catch (error) {
    res.status(500).send(error);
  }
});

export const metricsRouter = router;

export default metricsRouter;