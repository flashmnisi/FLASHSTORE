import { Router } from 'express';
import { createServiceProxy } from '../services/proxy';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.use('/', authLimiter, createServiceProxy('user'));

export default router;