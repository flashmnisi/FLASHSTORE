// apps/search-service/src/application/orchestration/query-parser.ts

import { SearchQueryVO } from '../domain/value-objects/search-query.vo';

export class QueryParser {
  /**
   * 🔥 Convert VO → Elasticsearch Query DSL
   */
  static toElasticQuery(vo: SearchQueryVO) {
    const must: any[] = [];
    const filter: any[] = vo.toElasticFilters();   // ← Fixed: use correct method name

    // =========================
    // 1. TEXT SEARCH (CORE)
    // =========================
    if (vo.query && vo.query.trim().length > 0) {
      must.push({
        multi_match: {
          query: vo.query,
          fields: [
            'name^4',
            'description^2',
            'category',
            'brand^2',
            'tags',
          ],
          fuzziness: 'AUTO',
        },
      });
    }

    // =========================
    // 2. SORTING
    // =========================
    let sort: any[] = [];

    switch (vo.sort) {
      case 'price_asc':
        sort = [{ price: 'asc' }];
        break;

      case 'price_desc':
        sort = [{ price: 'desc' }];
        break;

      case 'newest':
        sort = [{ createdAt: 'desc' }];
        break;

      case 'rating_desc':
        sort = [{ rating: 'desc' }];
        break;

      default:
        sort = [{ _score: 'desc' }];
    }

    // =========================
    // 3. FINAL QUERY
    // =========================
    return {
      index: 'products',
      from: vo.offset,
      size: vo.limit,

      query: {
        bool: {
          must,
          filter,
        },
      },

      sort,

      aggs: {
        categories: {
          terms: { field: 'category.keyword' },
        },
        brands: {
          terms: { field: 'brand.keyword' },
        },
        price_stats: {
          stats: { field: 'price' },
        },
      },
    };
  }

  /**
   * 🔥 Convert ES response → domain-safe format
   */
  static fromElasticResponse(response: any) {
    const hits = response.hits?.hits || [];

    return {
      products: hits.map((h: any) => ({
        ...h._source,
        score: h._score,
      })),
      total: response.hits?.total?.value || 0,
      facets: response.aggregations || {},
      took: response.took,
    };
  }
}