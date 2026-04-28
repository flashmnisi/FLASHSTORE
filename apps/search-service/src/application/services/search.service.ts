// apps/search-service/src/application/services/search.service.ts

import { SearchResultEntity } from '../../domain/entities/search-result.entity';
import { SearchQueryVO } from '../../domain/value-objects/search-query.vo';
import { ISearchRepository } from '../interfaces/search.repository';
import { SearchQueryDto } from '../dtos/search-query.dto';
import logger from '@org/shared-logger';

export class SearchService {
  constructor(private readonly searchRepository: ISearchRepository) {}

  async search(queryDto: SearchQueryDto): Promise<SearchResultEntity> {
    try {
      const queryVO = new SearchQueryVO(
        queryDto.query || '',
        {},
        queryDto.sort || 'relevance',
        queryDto.page || 1,
        queryDto.limit || 20,
        queryDto.minPrice,
        queryDto.maxPrice,
        queryDto.category ? [queryDto.category] : undefined,
      );

      const rawResult = await this.searchRepository.search(queryVO);

      const result = new SearchResultEntity(
        rawResult.products || [],
        rawResult.total || 0,
        rawResult.page || queryVO.page,
        rawResult.limit || queryVO.limit,
        [], // facets - can be expanded later
        queryDto.query
      );

      logger.info('Search executed', {
        query: queryDto.query,
        totalResults: result.total,
        page: result.page,
      });

      return result;

    } catch (error: any) {
      logger.error('Search failed', {
        error: error.message,
        query: queryDto.query,
      });
      throw error;
    }
  }
}