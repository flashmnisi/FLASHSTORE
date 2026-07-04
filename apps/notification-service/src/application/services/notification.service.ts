// apps/notification-service/src/application/services/notification.service.ts

import {
  NotificationEntity,
  NotificationType,
} from '../../domain/entities/notification.entity';
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
      // ====================== EARLY VALIDATION ======================
      if (dto.channel === 'email' && !dto.templateData?.email) {
        logger.error(
          '❌ Cannot process email notification - missing recipient email',
          {
            userId: dto.userId,
            type: dto.type,
            templateData: dto.templateData,
            availableKeys: Object.keys(dto.templateData || {}),
          }
        );

        const failedNotification = new NotificationEntity(
          '',
          dto.userId,
          dto.type as NotificationType,
          dto.templateName,
          dto.templateData,
          dto.data,
          dto.title,
          dto.message,
          'failed',
          dto.channel
        );

        const saved = await this.repository.save(failedNotification);
        await this.publishNotificationEvent(saved, false, dto);
        return saved;
      }

      // ====================== CREATE NOTIFICATION ======================
      const notification = new NotificationEntity(
        '',
        dto.userId,
        dto.type as NotificationType,
        dto.templateName,
        dto.templateData,
        dto.data,
        dto.title,
        dto.message,
        'pending',
        dto.channel
      );

      const saved = await this.repository.save(notification);

      let sendSuccess = false;

      // ====================== ATTEMPT TO SEND ======================
      try {
        if (dto.channel === 'email') {
          await this.emailProvider.send(saved);
          sendSuccess = true;
        } else if (dto.channel === 'sms') {
          await this.smsProvider.send(saved);
          sendSuccess = true;
        } else if (dto.channel === 'push') {
          await this.pushProvider.send(saved);
          sendSuccess = true;
        } else {
          logger.warn('Unsupported notification channel', {
            channel: dto.channel,
          });
        }
      } catch (sendError: any) {
        logger.error('Failed to send notification via provider', {
          notificationId: saved.id,
          channel: dto.channel,
          error: sendError.message,
        });
      }

      // ====================== UPDATE STATUS ======================
      saved.status = sendSuccess ? 'sent' : 'failed';
      await this.repository.update(saved);

      // ====================== PUBLISH OUTBOX EVENT ======================
      await this.publishNotificationEvent(saved, sendSuccess, dto);

      if (sendSuccess) {
        logger.info('✅ Notification sent successfully', {
          notificationId: saved.id,
          userId: dto.userId,
          channel: dto.channel,
          type: dto.type,
        });
      } else {
        logger.warn('⚠️ Notification failed to send', {
          notificationId: saved.id,
          userId: dto.userId,
          channel: dto.channel,
        });
      }

      return saved;
    } catch (error: any) {
      logger.error('❌ Critical failure in NotificationService.send', {
        userId: dto.userId,
        type: dto.type,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Helper to publish success/failed event to outbox
   */
  private async publishNotificationEvent(
    notification: NotificationEntity,
    success: boolean,
    dto: SendNotificationDto
  ) {
    await this.outboxService.write({
      topic: TOPICS.NOTIFICATIONS,
      event: success ? EVENTS.NOTIFICATION_SENT : EVENTS.NOTIFICATION_FAILED,
      data: {
        notificationId: notification.id,
        userId: dto.userId,
        type: dto.type,
        channel: dto.channel,
        templateName: dto.templateName,
        success,
        timestamp: new Date().toISOString(),
      },
      key: notification.id,
    });
  }
}
