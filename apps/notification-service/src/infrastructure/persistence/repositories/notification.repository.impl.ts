import { INotificationRepository } from '../../../application/interfaces/notification.repository';
import { NotificationEntity } from '../../../domain/entities/notification.entity';
import { NotificationModel } from '../models/notification.model';

export class NotificationRepositoryImpl implements INotificationRepository {
  async save(notification: NotificationEntity): Promise<NotificationEntity> {
    const created = await NotificationModel.create(notification);
    return new NotificationEntity(
      created._id.toString(),
      created.userId,
      created.type,
      created.title,
      created.message,
      created.data,
      created.status,
      created.channel,
      created.createdAt
    );
  }

  async update(notification: NotificationEntity): Promise<NotificationEntity> {
    await NotificationModel.findByIdAndUpdate(notification.id, notification);
    return notification;
  }
}