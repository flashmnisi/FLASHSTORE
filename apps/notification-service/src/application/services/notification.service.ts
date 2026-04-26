import { NotificationEntity, NotificationType } from '../../domain/entities/notification.entity';
import { SendNotificationDto } from '../dtos/send-notification.dto';
import { INotificationRepository } from '../interfaces/notification.repository';
import { IEmailProvider } from '../interfaces/email.provider';
import { ISmsProvider } from '../interfaces/sms.provider';
import { IPushProvider } from '../interfaces/push.provider';
import logger from '@org/shared-logger';

export class NotificationService {
  constructor(
    private readonly repository: INotificationRepository,
    private readonly emailProvider: IEmailProvider,
    private readonly smsProvider: ISmsProvider,
    private readonly pushProvider: IPushProvider
  ) {}

  async send(dto: SendNotificationDto): Promise<NotificationEntity> {
    try {
      const notification = new NotificationEntity(
        '',
        dto.userId,
        dto.type as NotificationType,
        dto.templateName,     // ✅ REQUIRED
        dto.templateData,  
        dto.title,
        dto.message,
        dto.data,
        'pending',
        dto.channel
      );

      // Save notification first
      const savedNotification = await this.repository.save(notification);

      // Send via chosen channel
      if (dto.channel === 'email') {
        await this.emailProvider.send(savedNotification);
      } else if (dto.channel === 'sms') {
        await this.smsProvider.send(savedNotification);
      } else if (dto.channel === 'push') {
        await this.pushProvider.send(savedNotification);
      }

      // Update status to sent
      savedNotification.status = 'sent';
      await this.repository.update(savedNotification);

      logger.info(`✅ Notification sent successfully`, {
        notificationId: savedNotification.id,
        userId: dto.userId,
        channel: dto.channel,
        type: dto.type
      });

      return savedNotification;
    } catch (error: any) {
      logger.error(`❌ Failed to send notification`, {
        userId: dto.userId,
        type: dto.type,
        error: error.message
      });

      throw error;
    }
  }
}