export const productMapping = {
  mappings: {
    properties: {
      id: { type: 'keyword' },

      name: {
        type: 'text',
        analyzer: 'standard',
        fields: {
          keyword: { type: 'keyword' },
          suggest: {
            type: 'completion',
          },
        },
      },

      description: {
        type: 'text',
        analyzer: 'standard',
      },

      price: { type: 'double' },
      currency: { type: 'keyword' },

      category: {
        type: 'keyword',
      },

      brand: {
        type: 'keyword',
      },

      tags: {
        type: 'keyword',
      },

      images: {
        type: 'keyword',
      },

      inStock: {
        type: 'boolean',
      },

      rating: {
        type: 'float',
      },

      reviewCount: {
        type: 'integer',
      },

      createdAt: {
        type: 'date',
      },

      updatedAt: {
        type: 'date',
      },
    },
  },

  settings: {
    number_of_shards: 1,
    number_of_replicas: 1,

    analysis: {
      analyzer: {
        autocomplete: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase', 'edge_ngram_filter'],
        },
      },

      filter: {
        edge_ngram_filter: {
          type: 'edge_ngram',
          min_gram: 2,
          max_gram: 20,
        },
      },
    },
  },
};