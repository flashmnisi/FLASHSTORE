// apps/search-service/src/presentation/routes/search.routes.ts

import { Router } from 'express';
import { searchController } from '../controllers/search.controller';   // ← Uncommented & Fixed
import { validate } from '../../utils/validators';
import { 
  searchQueryValidator, 
  suggestQueryValidator, 
  clickValidator 
} from '../../application/dtos/search-query.dto';

const router = Router();

/**
 * 🔍 Main Search
 * GET /api/search?q=wireless+headphones
 */
router.get(
  '/',
  validate(searchQueryValidator),
  searchController.search
);

/**
 * 🔮 Autocomplete / Suggestions
 * GET /api/suggest?q=headphones
 */
router.get(
  '/suggest',
  validate(suggestQueryValidator),
  searchController.suggest
);

/**
 * 🔥 Trending Searches
 * GET /api/search/trending
 */
router.get('/trending', searchController.trending);

/**
 * 👆 Track Product Click
 * POST /api/search/click
 */
router.post(
  '/click',
  validate(clickValidator),
  searchController.click
);

/**
 * Health Check
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'search-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;