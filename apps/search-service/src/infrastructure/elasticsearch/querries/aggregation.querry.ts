// persistence/queries/aggregation.query.ts

export const buildAggregations = () => {
  return {
    categories: {
      terms: { field: 'category.keyword' },
    },
    brands: {
      terms: { field: 'brand.keyword' },
    },
    price_ranges: {
      range: {
        field: 'price',
        ranges: [
          { to: 100 },
          { from: 100, to: 500 },
          { from: 500, to: 1000 },
          { from: 1000 },
        ],
      },
    },
  };
};