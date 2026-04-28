// apps/search-service/src/infrastructure/search/search.repository.impl.ts

import { Client } from '@elastic/elasticsearch';
import { SearchQueryVO } from '../../../domain/value-objects/search-query.vo';
import { SearchResultEntity } from '../../../domain/entities/search-result.entity';
import { PRODUCT_INDEX } from '../models/product-index.model';
import logger from '@org/shared-logger';

export class SearchRepositoryImpl {
  constructor(private readonly client: Client) {}

  /**
   * 🔥 MAIN SEARCH ENGINE
   */
  async search(query: SearchQueryVO): Promise<SearchResultEntity> {
    const must: any[] = [];
    const filter: any[] = [];

    // =========================
    // FULL TEXT SEARCH
    // =========================
    if (query.query) {
      must.push({
        multi_match: {
          query: query.query,
          fields: ['name^3', 'description', 'tags^2', 'brand'],
          fuzziness: 'AUTO',
        },
      });
    }

    // =========================
    // FILTERS
    // =========================
    if (query.categories?.length) {
      filter.push({
        terms: { category: query.categories },
      });
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.push({
        range: {
          price: {
            gte: query.minPrice,
            lte: query.maxPrice,
          },
        },
      });
    }

    // =========================
    // QUERY BUILD
    // =========================
    const response = await this.client.search({
      index: PRODUCT_INDEX,
      from: query.offset,
      size: query.limit,
      query: {
        bool: {
          must,
          filter,
        },
      },
      sort: this.getSort(query.sort),
    });

    const hits = response.hits.hits.map((hit: any) => hit._source);

    const total =
      typeof response.hits.total === 'number'
        ? response.hits.total
        : response.hits.total?.value || 0;

    // Fixed: Pass correct arguments to SearchResultEntity
    return new SearchResultEntity(
      hits,                    // products
      total,                   // total
      query.page,              // page
      query.limit,             // limit
      {},                      // facets (empty for now)
      query.query,             // query
      response.took            // took (response time from Elasticsearch)
    );
  }

  /**
   * 🔥 SORTING ENGINE
   */
  private getSort(sort: string) {
    switch (sort) {
      case 'price_asc':
        return [{ price: 'asc' }];
      case 'price_desc':
        return [{ price: 'desc' }];
      case 'newest':
        return [{ createdAt: 'desc' }];
      case 'rating_desc':
        return [{ rating: 'desc' }];
      default:
        return ['_score'];
    }
  }

  /**
   * 🔥 DELETE PRODUCT FROM INDEX
   */
  async delete(productId: string) {
    try {
      await this.client.delete({
        index: PRODUCT_INDEX,
        id: productId,
      });

      logger.info('🗑️ Product removed from index', { productId });
    } catch (error: any) {
      logger.error('Failed to delete from index', {
        error: error.message,
        productId,
      });
    }
  }
}