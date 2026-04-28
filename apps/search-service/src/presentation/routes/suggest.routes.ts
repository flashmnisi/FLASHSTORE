import { Router } from 'express';
import { suggestController } from '../controllers/suggest.controller';

const router = Router();

/**
 * ⚡ AUTOCOMPLETE
 * GET /api/search/suggest?q=iph
 */
router.get('/suggest', suggestController.suggest);

/**
 * 🔥 TRENDING SEARCHES
 * GET /api/search/trending?limit=10
 */
router.get('/trending', suggestController.trending);

export default router;