

// apps/gateway/src/routes/auth.routes.ts

import { Router } from 'express';
import { createServiceProxy } from '../infrastructure/proxy/proxy.factory';
import { authRateLimit } from '../config/rate-limit';

const router = Router();

router.use(
  '/',
  authRateLimit,
  createServiceProxy('user')
);

export default router;