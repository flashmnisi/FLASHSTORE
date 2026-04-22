export class NotificationTypeVO {
  private constructor(private readonly value: string) {}

  static from(value: string): NotificationTypeVO {
    if (!Object.values(NotificationType).includes(value as any)) {
      throw new Error(`Invalid notification type: ${value}`);
    }
    return new NotificationTypeVO(value);
  }

  getValue(): string {
    return this.value;
  }
}