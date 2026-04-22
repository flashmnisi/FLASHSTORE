import { SearchResultEntity } from '../../domain/entities/search-result.entity';
import { SearchQueryVO } from '../../domain/value-objects/search-query.vo';
import { ISearchRepository } from '../interfaces/search.repository';
import { SearchQueryDto } from '../dtos/search-query.dto';
import logger from '../../utils/logger';

export class SearchService {
  constructor(private readonly searchRepository: ISearchRepository) {}

  async search(queryDto: SearchQueryDto): Promise<SearchResultEntity> {
    try {
      const queryVO = new SearchQueryVO(
        queryDto.query || '',
        {},
        queryDto.sort,
        queryDto.page,
        queryDto.limit,
        queryDto.minPrice,
        queryDto.maxPrice,
        queryDto.category ? [queryDto.category] : undefined,
      );

      const result = await this.searchRepository.search(queryVO);

      logger.info('Search executed', {
        query: queryDto.query,
        totalResults: result.total,
        page: queryDto.page,
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