import { publish } from '@org/shared-kafka';
import logger from '../../utils/logger';
import { KAFKA_TOPICS } from './topics';

export class SearchProducer {
  private readonly service = 'search-service';

  /**
   * 🔍 User performed search
   */
  async searchPerformed(data: {
    query: string;
    userId?: string;
    filters?: Record<string, any>;
    resultCount: number;
  }) {
    try {
      await publish({
        topic: KAFKA_TOPICS.ANALYTICS,
        key: data.userId || data.query,
        message: {
          event: 'search.performed',
          data,
        },
        headers: {
          'x-service': this.service,
        },
      });

      logger.info('📊 Search event published', {
        query: data.query,
        resultCount: data.resultCount,
      });
    } catch (error: any) {
      logger.error('Failed to publish search event', {
        error: error.message,
      });
    }
  }

  /**
   * 👆 User clicked a product
   */
  async productClicked(data: {
    productId: string;
    query: string;
    userId?: string;
    position?: number;
  }) {
    try {
      await publish({
        topic: KAFKA_TOPICS.ANALYTICS,
        key: data.userId || data.productId,
        message: {
          event: 'search.clicked',
          data,
        },
      });

      logger.info('👆 Click event published', {
        productId: data.productId,
      });
    } catch (error: any) {
      logger.error('Click event failed', {
        error: error.message,
      });
    }
  }

  /**
   * ⚡ Autocomplete used
   */
  async suggestUsed(data: {
    query: string;
    selected?: string;
  }) {
    try {
      await publish({
        topic: KAFKA_TOPICS.ANALYTICS,
        key: data.query,
        message: {
          event: 'search.suggest',
          data,
        },
      });

      logger.info('⚡ Suggest event published', {
        query: data.query,
      });
    } catch (error: any) {
      logger.error('Suggest event failed', {
        error: error.message,
      });
    }
  }

  /**
   * 🔥 Trending signal (optional aggregation service)
   */
  async trendingSignal(data: {
    query: string;
  }) {
    try {
      await publish({
        topic: KAFKA_TOPICS.ANALYTICS,
        key: data.query,
        message: {
          event: 'search.trending',
          data,
        },
      });
    } catch (error: any) {
      logger.error('Trending signal failed', {
        error: error.message,
      });
    }
  }

  /**
   * 🔄 Reindex trigger (advanced)
   */
  async triggerReindex(data: {
    productId: string;
  }) {
    try {
      await publish({
        topic: KAFKA_TOPICS.PRODUCTS,
        key: data.productId,
        message: {
          event: 'product.reindex',
          data,
        },
      });

      logger.info('🔄 Reindex triggered', {
        productId: data.productId,
      });
    } catch (error: any) {
      logger.error('Reindex trigger failed', {
        error: error.message,
      });
    }
  }
}

export const searchProducer = new SearchProducer();