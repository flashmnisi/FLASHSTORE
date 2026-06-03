// apps/notification-service/src/application/services/notification.service.ts

import { NotificationEntity, NotificationType } from '../../domain/entities/notification.entity';
import { SendNotificationDto } from '../dtos/send-notification.dto';
import { INotificationRepository } from '../interfaces/notification.repository';
import { IEmailProvider } from '../interfaces/email.provider';
import { ISmsProvider } from '../interfaces/sms.provider';
import { IPushProvider } from '../interfaces/push.provider';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';   

import logger from '@org/shared-logger';
import { EVENTS, TOPICS } from '@org/shared-kafka';

export class NotificationService {
  constructor(
    private readonly repository: INotificationRepository,
    private readonly emailProvider: IEmailProvider,
    private readonly smsProvider: ISmsProvider,
    private readonly pushProvider: IPushProvider,
    private readonly outboxService: OutboxService   
  ) {}

  async send(dto: SendNotificationDto): Promise<NotificationEntity> {
    try {
      const notification = new NotificationEntity(
        '',
        dto.userId,
        dto.type as NotificationType,
        dto.templateName,
        dto.templateData,
        dto.title,
        dto.message,
        dto.data,
        'pending',
        dto.channel
      );

      // Save notification first
      const savedNotification = await this.repository.save(notification);

      let sendSuccess = false;

      // Send via chosen channel
      if (dto.channel === 'email') {
        await this.emailProvider.send(savedNotification);
        sendSuccess = true;
      } else if (dto.channel === 'sms') {
        await this.smsProvider.send(savedNotification);
        sendSuccess = true;
      } else if (dto.channel === 'push') {
        await this.pushProvider.send(savedNotification);
        sendSuccess = true;
      }

      // Update status
      savedNotification.status = sendSuccess ? 'sent' : 'failed';
      await this.repository.update(savedNotification);

      // Write to Outbox for analytics / other services
      await this.outboxService.write({
        topic: TOPICS.NOTIFICATIONS,
        event: sendSuccess ? EVENTS.NOTIFICATION_SENT : EVENTS.NOTIFICATION_FAILED,
        data: {
          notificationId: savedNotification.id,
          userId: dto.userId,
          type: dto.type,
          channel: dto.channel,
          templateName: dto.templateName,
          success: sendSuccess,
        },
        key: savedNotification.id,
      });

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