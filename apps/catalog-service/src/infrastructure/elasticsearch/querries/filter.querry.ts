// persistence/queries/filter.query.ts

export const buildFilters = (params: {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}) => {
  const filters: any[] = [];

  if (params.category) {
    filters.push({ term: { category: params.category } });
  }

  if (params.brand) {
    filters.push({ term: { brand: params.brand } });
  }

  if (params.inStock !== undefined) {
    filters.push({ term: { inStock: params.inStock } });
  }

  if (params.minPrice || params.maxPrice) {
    filters.push({
      range: {
        price: {
          gte: params.minPrice,
          lte: params.maxPrice,
        },
      },
    });
  }

  return filters;
};