// apps/search-service/src/infrastructure/kafka/search.producer.ts

import { publish } from '@org/shared-kafka';
import { TOPICS, EVENTS, KafkaEvent } from './topics';
import logger from '@org/shared-logger';

export class SearchProducer {
  private readonly service = 'search-service';

  // ==============================
  // 🔍 SEARCH PERFORMED
  // ==============================
  async searchPerformed(data: {
    query: string;
    userId?: string;
    filters?: Record<string, any>;
    resultCount: number;
    correlationId?: string;
  }) {
    try {
      const message: KafkaEvent = {
        event: EVENTS.SEARCH.PERFORMED,
        data,
        timestamp: new Date().toISOString(),
        correlationId: data.correlationId,
        service: this.service,
      };

      await publish({
        topic: TOPICS.SEARCH,
        key: data.userId || data.query,
        message,
      });

      logger.info('📊 Search performed event published', {
        query: data.query,
        resultCount: data.resultCount,
      });
    } catch (error: any) {
      logger.error('Failed to publish search.performed event', {
        error: error.message,
        query: data.query,
      });
    }
  }

  // ==============================
  // 👆 PRODUCT CLICKED
  // ==============================
  async productClicked(data: {
    productId: string;
    query: string;
    userId?: string;
    position?: number;
    correlationId?: string;
  }) {
    try {
      const message: KafkaEvent = {
        event: EVENTS.SEARCH.CLICKED,
        data,
        timestamp: new Date().toISOString(),
        correlationId: data.correlationId,
        service: this.service,
      };

      await publish({
        topic: TOPICS.SEARCH,
        key: data.userId || data.productId,
        message,
      });

      logger.info('👆 Product clicked event published', {
        productId: data.productId,
        query: data.query,
      });
    } catch (error: any) {
      logger.error('Failed to publish search.clicked event', {
        error: error.message,
        productId: data.productId,
      });
    }
  }

  // ==============================
  // ⚡ AUTOCOMPLETE / SUGGEST
  // ==============================
  async suggestUsed(data: {
    query: string;
    selected?: string;
    userId?: string;
  }) {
    try {
      const message: KafkaEvent = {
        event: EVENTS.SEARCH.SUGGEST_USED,
        data,
        timestamp: new Date().toISOString(),
        service: this.service,
      };

      await publish({
        topic: TOPICS.SEARCH,
        key: data.userId || data.query,
        message,
      });

      logger.info('⚡ Search suggest event published', { query: data.query });
    } catch (error: any) {
      logger.error('Failed to publish search.suggest event', {
        error: error.message,
      });
    }
  }

  // ==============================
  // 🔥 TRENDING SIGNAL
  // ==============================
  async trendingSignal(data: {
    query: string;
    userId?: string;
  }) {
    try {
      const message: KafkaEvent = {
        event: EVENTS.SEARCH.TRENDING,
        data,
        timestamp: new Date().toISOString(),
        service: this.service,
      };

      await publish({
        topic: TOPICS.SEARCH,
        key: data.query,
        message,
      });
    } catch (error: any) {
      logger.error('Failed to publish search.trending event', {
        error: error.message,
      });
    }
  }

  // ==============================
  // 🔄 TRIGGER REINDEX
  // ==============================
  async triggerReindex(data: {
    productId: string;
    correlationId?: string;
  }) {
    try {
      const message: KafkaEvent = {
        event: EVENTS.PRODUCT.UPDATED,
        data,
        timestamp: new Date().toISOString(),
        correlationId: data.correlationId,
        service: this.service,
      };

      await publish({
        topic: TOPICS.PRODUCT,
        key: data.productId,
        message,
      });

      logger.info('🔄 Reindex triggered for product', {
        productId: data.productId,
      });
    } catch (error: any) {
      logger.error('Failed to publish reindex event', {
        error: error.message,
        productId: data.productId,
      });
    }
  }
}

// Singleton
export const searchProducer = new SearchProducer();