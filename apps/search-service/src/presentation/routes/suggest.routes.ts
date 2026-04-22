import { Router } from 'express';
import { suggestController } from '../controllers/suggest.controller';

const router = Router();

/**
 * ⚡ AUTOCOMPLETE
 * GET /api/suggest?q=iph
 */
router.get('/', suggestController.suggest);

export default router;