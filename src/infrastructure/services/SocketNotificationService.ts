import { INotificationService } from "../../application/services/INotificationService";
import { ISocketService } from "../../application/services/ISocketService";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";

export class SocketNotificationService implements INotificationService {
  constructor(
    private readonly _socketService: ISocketService,
    private readonly _notificationRepository: INotificationRepository
  ) {}

  async send(userId: string, notification: {
    type: "success" | "error" | "info" | "warning" | "alert";
    title: string;
    message: string;
    link?: string;
  }): Promise<void> {
    try {
      // Persist to database using repository
      const savedNotification = await this._notificationRepository.create({
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link,
      });

      // Emit via socket
      this._socketService.emitNotification({
        id: savedNotification.id,
        type: notification.type === "error" ? "alert" : notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        read: savedNotification.read,
        timestamp: savedNotification.createdAt || new Date(),
      }, userId);
    } catch (error) {
      console.error("Failed to send notification:", error);
      // We don't throw here to avoid failing the main business logic if notifications fail
    }
  }
}

