import { NotificationEntity } from '../../domain/entities/notification.entity';

export interface INotificationRepository {
  /**
   * Save a new notification to the database
   */
  save(notification: NotificationEntity): Promise<NotificationEntity>;

  /**
   * Update an existing notification 
   */
  update(notification: NotificationEntity): Promise<NotificationEntity>;

  /**
   * Find notifications by user ID 
   */
  findByUserId(userId: string): Promise<NotificationEntity[]>;

  /**
   * Find a notification by ID
   */
  findById(id: string): Promise<NotificationEntity | null>;
}