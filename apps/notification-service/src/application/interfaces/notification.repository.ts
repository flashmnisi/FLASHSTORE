import { NotificationEntity } from '../../domain/entities/notification.entity';

export interface INotificationRepository {
  /**
   * Save a new notification to the database
   */
  save(notification: NotificationEntity): Promise<NotificationEntity>;

  /**
   * Update an existing notification (e.g., status change to 'sent' or 'failed')
   */
  update(notification: NotificationEntity): Promise<NotificationEntity>;

  /**
   * Find notifications by user ID (optional, for future use)
   */
  findByUserId(userId: string): Promise<NotificationEntity[]>;

  /**
   * Find a notification by ID
   */
  findById(id: string): Promise<NotificationEntity | null>;
}