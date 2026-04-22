import { Router } from 'express';
import { indexController } from '../controllers/index.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * 🔒 INDEX PRODUCT
 */
router.post('/product', authMiddleware, indexController.indexProduct);

/**
 * 🔥 BULK INDEX
 */
router.post('/bulk', authMiddleware, indexController.bulkIndex);

/**
 * ❤️ HEALTH
 */
router.get('/health', indexController.health);

export default router;