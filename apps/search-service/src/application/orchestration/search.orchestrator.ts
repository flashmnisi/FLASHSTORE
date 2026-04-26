import { ISearchRepository } from '../interfaces/search.repository';
import { SearchQueryDto } from '../dtos/search-query.dto';
import { QueryNormalizer } from './query-normalizer';
import { RankingEngine } from './ranking.engine';
import { SearchCache } from '../../infrastructure/cache/search-cache';
import logger from '@org/shared-logger';
//import logger from '../../utils/logger';

export class SearchOrchestrator {
  private normalizer = new QueryNormalizer();
  private ranking = new RankingEngine();
  private cache = new SearchCache();

  constructor(private readonly repository: ISearchRepository) {}

  async search(queryDto: SearchQueryDto, user?: any) {
    try {
      // =========================
      // 1. Normalize query
      // =========================
      const normalizedQuery = this.normalizer.normalize(queryDto.query);

      const cacheKey = this.normalizer.buildCacheKey({
        query: normalizedQuery,
        page: queryDto.page,
        limit: queryDto.limit,
        sort: queryDto.sort,
        filters: {
          category: queryDto.category,
          brand: queryDto.brand,
          minPrice: queryDto.minPrice,
          maxPrice: queryDto.maxPrice,
        },
      });

      // =========================
      // 2. Cache check
      // =========================
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // =========================
      // 3. Call repository (Elastic)
      // =========================
      const result = await this.repository.search({
        query: normalizedQuery,
        sort: queryDto.sort,
        page: queryDto.page,
        limit: queryDto.limit,
        minPrice: queryDto.minPrice,
        maxPrice: queryDto.maxPrice,
        categories: queryDto.category ? [queryDto.category] : undefined,
        filters: {},
      } as any); // VO handled in repo

      // =========================
      // 4. Rank results
      // =========================
      const rankedProducts = this.ranking.rank(result.products, user);

      const finalResult = {
        ...result,
        products: rankedProducts,
      };

      // =========================
      // 5. Cache result
      // =========================
      await this.cache.set(cacheKey, finalResult);

      logger.info('Search executed (orchestrator)', {
        query: normalizedQuery,
        total: result.total,
      });

      return finalResult;

    } catch (error: any) {
      logger.error('Search orchestrator failed', {
        error: error.message,
      });
      throw error;
    }
  }
}