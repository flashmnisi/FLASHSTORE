import { Router } from 'express';
import { createServiceProxy } from '../infrastructure/proxy/proxy.factory';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Inventory Service (protected)
 */
router.use('/', protect, createServiceProxy('inventory'));

export default router;