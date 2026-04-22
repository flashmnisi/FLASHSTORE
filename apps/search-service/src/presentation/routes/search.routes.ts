import { Router } from 'express';
import { searchController } from '../controllers/search.controller';
import { validate } from '../../utils/validators';
import { searchQuerySchema } from '../dtos/search-query.dto';

const router = Router();

/**
 * 🔍 SEARCH PRODUCTS (PUBLIC)
 * GET /api/search
 */
router.get(
  '/',
  validate(searchQuerySchema),
  searchController.search
);

/**
 * 🔥 TRENDING SEARCHES
 */
router.get('/trending', searchController.trending);

/**
 * 👆 TRACK CLICK
 */
router.post('/click', searchController.click);

/**
 * ❤️ HEALTH CHECK
 */
router.get('/health', searchController.health);

export default router;