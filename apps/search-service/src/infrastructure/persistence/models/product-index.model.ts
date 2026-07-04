export const PRODUCT_INDEX = 'products';

/**
 * 🔥 Elasticsearch mapping (production-ready)
 */
export const productIndexMapping = {
  mappings: {
    properties: {
      id: { type: 'keyword' },

      name: {
        type: 'text',
        analyzer: 'standard',
        fields: {
          keyword: { type: 'keyword' },
          suggest: { type: 'completion' },
        },
      },

      description: {
        type: 'text',
        analyzer: 'standard',
      },

      category: { type: 'keyword' },
      brand: { type: 'keyword' },

      price: { type: 'double' },
      currency: { type: 'keyword' },

      tags: { type: 'keyword' },

      images: { type: 'keyword' },

      inStock: { type: 'boolean' },

      rating: { type: 'float' },
      reviewCount: { type: 'integer' },

      popularityScore: { type: 'float' },

      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
    },
  },

  settings: {
    analysis: {
      analyzer: {
        custom_analyzer: {
          type: 'standard',
          stopwords: '_english_',
        },
      },
    },
  },
};
