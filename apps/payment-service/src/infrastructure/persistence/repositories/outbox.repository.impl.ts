// apps/payment-service/src/infrastructure/persistence/mongoose/repositories/outbox.repository.impl.ts

import logger from '@org/shared-logger';
import { IOutboxRepository } from '../../../domain/repositories/outbox.repository';
import { AppError } from '../../../middlewares/error.middleware';
import { OutboxModel } from '../../outbox/outbox.model';

export class OutboxRepositoryImpl implements IOutboxRepository {

  async create(data: {
    topic: string;
    event: string;
    payload: any;
    key?: string;
    status?: string;
    retries?: number;
  }) {
    try {
      const outbox = await OutboxModel.create({
        topic: data.topic,
        event: data.event,
        payload: data.payload,
        key: data.key,
        status: data.status || 'pending',
        retries: data.retries || 0,
        nextRetryAt: new Date(),
      });

      return outbox;
    } catch (error: any) {
      logger.error('Failed to create outbox entry', { error: error.message });
      throw new AppError('Failed to create outbox entry', 500);
    }
  }

  async findPending(limit = 50) {
    try {
      return await OutboxModel.find({
        status: 'pending',
        nextRetryAt: { $lte: new Date() },
      })
        .sort({ createdAt: 1 })
        .limit(limit)
        .lean();
    } catch (error: any) {
      logger.error('Failed to fetch pending outbox events', { error: error.message });
      throw error;
    }
  }

  async markAsProcessed(id: string): Promise<void> {
    try {
      await OutboxModel.updateOne(
        { _id: id },
        { 
          status: 'processed',
          $unset: { lockedAt: '' }
        }
      );
    } catch (error: any) {
      logger.error('Failed to mark outbox as processed', { id, error: error.message });
    }
  }

  async markAsFailed(id: string, errorMessage: string, retries: number): Promise<void> {
    try {
      await OutboxModel.updateOne(
        { _id: id },
        {
          status: retries >= 5 ? 'failed' : 'pending',
          retries,
          error: errorMessage,
          nextRetryAt: new Date(Date.now() + Math.min(1000 * Math.pow(2, retries), 60000)),
          $unset: { lockedAt: '' },
        }
      );
    } catch (error: any) {
      logger.error('Failed to mark outbox as failed', { id, error: error.message });
    }
  }

  async lockForProcessing(id: string): Promise<boolean> {
    try {
      const locked = await OutboxModel.findOneAndUpdate(
        { 
          _id: id, 
          status: 'pending' 
        },
        {
          status: 'processing',
          lockedAt: new Date(),
        },
        { new: true }
      );

      return !!locked;
    } catch (error: any) {
      logger.warn('Failed to lock outbox message', { id, error: error.message });
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await OutboxModel.deleteOne({ _id: id });
      return result.deletedCount > 0;
    } catch (error: any) {
      logger.error('Failed to delete outbox entry', { id });
      return false;
    }
  }
}