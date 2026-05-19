// apps/gateway/src/presentation/routes/protected/user.routes.ts

import { Router } from 'express';
import { createServiceProxy } from '../infrastructure/proxy/proxy.factory';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use('/',protect, createServiceProxy('user'));

export default router;