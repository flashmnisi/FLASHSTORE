//gateway/routes/index.ts

import { Router } from 'express';

import { protect } from '../middlewares/auth.middleware';
//import { authorize } from '../middlewares/authorize.middleware';

import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import cartRoutes from './cart.routes';
import catalogRoutes from './catalog.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import inventoryRoutes from './inventory.routes';

const router = Router();

/**
 * ==========================================
 * HEALTH
 * ==========================================
 */

router.get('/health', (_, res) => {
  res.status(200).json({
    success: true,
    service: 'gateway',
  });
});

/**
 * ==========================================
 * PUBLIC ROUTES
 * ==========================================
 */

router.use('/api/auth', authRoutes);

// public products
router.use('/api/catalog', catalogRoutes);

/**
 * ==========================================
 * AUTHENTICATED ROUTES
 * ==========================================
 */

router.use('/api/users', protect, userRoutes);

router.use('/api/cart', protect, cartRoutes);

router.use('/api/orders', protect, orderRoutes);

router.use('/api/payments', protect, paymentRoutes);

/**
 * Inventory normally requires login
 */

router.use('/api/inventory', protect, inventoryRoutes);

export default router;