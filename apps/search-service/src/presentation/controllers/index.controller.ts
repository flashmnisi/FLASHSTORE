import { Request, Response } from 'express';
import { IndexService } from '../../application/services/index.service';
import { ProductIndexEntity } from '../../domain/entities/product-index.entity';
import logger from '../../utils/logger';

const indexService = new IndexService(/* inject indexer provider */);

export const indexController = {
  /**
   * 🔥 Index single product
   */
  async indexProduct(req: Request, res: Response) {
    try {
      const payload = req.body;

      const product = new ProductIndexEntity(
        payload.id,
        payload.name,
        payload.description,
        payload.price,
        payload.currency,
        payload.category,
        payload.brand,
        payload.tags,
        payload.images,
        payload.inStock,
        payload.rating,
        payload.reviewCount
      );

      await indexService.indexProduct(product);

      res.json({
        success: true,
        message: 'Product indexed successfully',
      });
    } catch (error: any) {
      logger.error('Index product failed', { error: error.message });

      res.status(500).json({
        success: false,
        message: 'Indexing failed',
      });
    }
  },

  /**
   * 🔥 Bulk index products
   */
  async bulkIndex(req: Request, res: Response) {
    try {
      const products = req.body.products || [];

      const entities = products.map(
        (p: any) =>
          new ProductIndexEntity(
            p.id,
            p.name,
            p.description,
            p.price,
            p.currency,
            p.category,
            p.brand,
            p.tags,
            p.images,
            p.inStock,
            p.rating,
            p.reviewCount
          )
      );

      await indexService.bulkIndex(entities);

      res.json({
        success: true,
        message: `${entities.length} products indexed`,
      });
    } catch (error: any) {
      logger.error('Bulk index failed', { error: error.message });

      res.status(500).json({
        success: false,
        message: 'Bulk indexing failed',
      });
    }
  },

  /**
   * 🔥 Health check for indexer
   */
  async health(req: Request, res: Response) {
    res.json({
      success: true,
      service: 'search-indexer',
      status: 'OK',
    });
  },
};