// persistence/queries/fuzzy.query.ts

export const buildFuzzyQuery = (query: string) => {
  if (!query) return [];

  return [
    {
      match: {
        name: {
          query,
          fuzziness: 'AUTO',
          operator: 'and',
        },
      },
    },
    {
      match: {
        description: {
          query,
          fuzziness: 'AUTO',
        },
      },
    },
  ];
};