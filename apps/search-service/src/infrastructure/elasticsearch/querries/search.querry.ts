// persistence/queries/search.query.ts

import { buildAggregations } from "./aggregation.querry";
import { buildFilters } from "./filter.querry";
import { buildFuzzyQuery } from "./fuzzy.querry";

export const buildSearchQuery = (params: {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  limit: number;
  sort: string;
}) => {
  const must = buildFuzzyQuery(params.query || '');
  const filter = buildFilters(params);

  const from = (params.page - 1) * params.limit;

  const sort = getSort(params.sort);

  return {
    from,
    size: params.limit,

    query: {
      bool: {
        must,
        filter,
      },
    },

    sort,

    aggs: buildAggregations(),
  };
};

const getSort = (sort: string) => {
  switch (sort) {
    case 'price_asc':
      return [{ price: 'asc' }];

    case 'price_desc':
      return [{ price: 'desc' }];

    case 'newest':
      return [{ createdAt: 'desc' }];

    default:
      return [{ _score: 'desc' }];
  }
};