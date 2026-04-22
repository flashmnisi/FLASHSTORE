import { Request, Response } from 'express';
import { NotificationService } from '../../application/services/notification.service';
import { SendNotificationDto, sendNotificationSchema } from '../../application/dtos/send-notification.dto';
import logger from '@org/shared-logger';

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  async sendNotification(req: Request, res: Response) {
    try {
      const dto: SendNotificationDto = sendNotificationSchema.parse(req.body);

      const notification = await this.notificationService.send(dto);

      res.status(200).json({
        success: true,
        message: 'Notification sent successfully',
        notification: {
          id: notification.id,
          userId: notification.userId,
          type: notification.type,
          status: notification.status,
          channel: notification.channel,
        },
      });
    } catch (error: any) {
      logger.error('Failed to send notification', { error: error.message });
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}