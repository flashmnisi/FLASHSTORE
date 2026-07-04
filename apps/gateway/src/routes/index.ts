//gateway/routes/index.ts

import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';

// Import each module
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import cartRoutes from './cart.routes';
import catalogRoutes from './catalog.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import inventoryRoutes from './inventory.routes';

const router = Router();

// ====================== PUBLIC ROUTES ======================
router.use('/api/auth', authRoutes);

// ====================== PROTECTED ROUTES ======================
const protectedRouter = Router();
protectedRouter.use(protect);          

protectedRouter.use('/api/users', userRoutes);
protectedRouter.use('/api/cart', cartRoutes);
protectedRouter.use('/api/orders', orderRoutes);
protectedRouter.use('/api/catalog', catalogRoutes);
protectedRouter.use('/api/payments', paymentRoutes);
protectedRouter.use('/api/inventory', inventoryRoutes);

router.use(protectedRouter);

export default router;