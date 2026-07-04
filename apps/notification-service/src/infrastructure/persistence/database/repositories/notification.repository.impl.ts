// apps/notification-service/src/infrastructure/persistence/database/repositories/notification.repository.impl.ts

import { INotificationRepository } from '../../../../application/interfaces/notification.repository';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { toNotificationType } from '../../../../domain/value-objects/notification-type.vo';
import { NotificationModel, NotificationDocument } from '../notification.model';

/**
 * Mapper (DB ↔ Domain)
 */
class NotificationMapper {
  static toEntity(doc: NotificationDocument): NotificationEntity {
    return new NotificationEntity(
      doc._id.toString(),
      doc.userId,
      toNotificationType(doc.type),
      doc.templateName,
      doc.templateData || {},
      doc.data,
      doc.title || '',
      doc.message || '',
      doc.status,
      doc.channel,
      doc.createdAt
    );
  }

  static toPersistence(entity: NotificationEntity) {
    return {
      userId: entity.userId,
      type: entity.type,
      templateName: entity.templateName,
      templateData: entity.templateData,
      data: entity.data,
      title: entity.title,
      message: entity.message,
      status: entity.status,
      channel: entity.channel,
    };
  }
}

/**
 * Repository Implementation
 */
export class NotificationRepositoryImpl implements INotificationRepository {
  async save(notification: NotificationEntity): Promise<NotificationEntity> {
    const created = await NotificationModel.create(
      NotificationMapper.toPersistence(notification)
    );
    return NotificationMapper.toEntity(created);
  }

  async update(notification: NotificationEntity): Promise<NotificationEntity> {
    const updated = await NotificationModel.findByIdAndUpdate(
      notification.id,
      NotificationMapper.toPersistence(notification),
      {
        returnDocument: 'after',
      }
    );

    if (!updated) {
      throw new Error('Notification not found');
    }

    return NotificationMapper.toEntity(updated);
  }

  async findByUserId(userId: string): Promise<NotificationEntity[]> {
    const docs = await NotificationModel.find({ userId }).sort({
      createdAt: -1,
    });

    return docs.map(NotificationMapper.toEntity);
  }

  async findById(id: string): Promise<NotificationEntity | null> {
    const doc = await NotificationModel.findById(id);
    if (!doc) return null;

    return NotificationMapper.toEntity(doc);
  }
}
