// apps/search-service/src/application/orchestration/search.orchestrator.ts

import { ISearchRepository } from '../interfaces/search.repository';
import { SearchQueryDto } from '../dtos/search-query.dto';
import { QueryNormalizer } from './query-normalizer';
import { RankingEngine } from './ranking.engine';
import logger from '@org/shared-logger';
import { SearchCache } from '../../infrastructure/cache/search-cache';
import { SearchQueryVO } from '../../domain/value-objects/search-query.vo';

export class SearchOrchestrator {
  private readonly normalizer = new QueryNormalizer();
  private readonly ranking = new RankingEngine();
  private readonly cache = new SearchCache();

  constructor(private readonly repository: ISearchRepository) {}

  async search(queryDto: SearchQueryDto, user?: any) {
    try {
      const startTime = Date.now();

      if (!queryDto.query?.trim()) {
        throw new Error('Search query cannot be empty');
      }

      const normalizedQuery = this.normalizer.normalize(queryDto.query);

      // Build cache key
      const cacheKey = this.normalizer.buildCacheKey({
        query: normalizedQuery,
        page: queryDto.page || 1,
        limit: queryDto.limit || 20,
        sort: queryDto.sort || 'relevance',
        category: queryDto.category,
        brand: queryDto.brand,
        minPrice: queryDto.minPrice,
        maxPrice: queryDto.maxPrice,
      });

      // Check cache
      const cachedResult = await this.cache.get(cacheKey);
      if (cachedResult) {
        logger.info('⚡ Search cache hit', { query: normalizedQuery });
        return cachedResult;
      }

      // Create SearchQueryVO instance
      const searchQueryVO = new SearchQueryVO(
        normalizedQuery,
        {},
        queryDto.sort || 'relevance',
        queryDto.page || 1,
        queryDto.limit || 20,
        queryDto.minPrice,
        queryDto.maxPrice,
        queryDto.category ? [queryDto.category] : undefined
      );

      // Execute search
      const searchResult = await this.repository.search(searchQueryVO);

      // Apply ranking
      const rankedProducts = this.ranking.rank(
        searchResult.products || [],
        user
      );

      const finalResult = {
        ...searchResult,
        products: rankedProducts,
        query: normalizedQuery,
        processingTimeMs: Date.now() - startTime,
      };

      // Cache result
      await this.cache.set(cacheKey, finalResult);

      logger.info('✅ Search completed', {
        query: normalizedQuery,
        totalResults: searchResult.total || 0,
        processingTimeMs: finalResult.processingTimeMs,
      });

      return finalResult;
    } catch (error: any) {
      logger.error('Search orchestrator failed', {
        query: queryDto.query,
        error: error.message,
      });
      throw error;
    }
  }
}
