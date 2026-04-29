import { INotification } from "../../domain/repositories/INotificationRepository";
import { NotificationResponseDto, NotificationCollectionResponseDto } from "../dto/NotificationDto";

export class NotificationMapper {
  static toResponseDto(notification: INotification): NotificationResponseDto {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      read: notification.read,
      createdAt: notification.createdAt,
      timestamp: notification.createdAt,
    };
  }

  static toCollectionResponseDto(notifications: INotification[]): NotificationCollectionResponseDto {
    return {
      items: notifications.map((n) => this.toResponseDto(n)),
      total: notifications.length,
    };
  }
}
