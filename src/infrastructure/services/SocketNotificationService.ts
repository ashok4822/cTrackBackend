import { INotificationService } from "../../application/services/INotificationService";
import { NotificationModel } from "../models/NotificationModel";
import { ISocketService } from "../../application/services/ISocketService";

export class SocketNotificationService implements INotificationService {
  constructor(private socketService: ISocketService) {}

  async send(userId: string, notification: {
    type: "success" | "error" | "info" | "warning" | "alert";
    title: string;
    message: string;
    link?: string;
  }): Promise<void> {
    try {
      // Persist to database
      const savedNotification = await NotificationModel.create({
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link,
      });

      // Emit via socket
      this.socketService.emitNotification({
        id: savedNotification._id.toString(),
        type: notification.type === "error" ? "alert" : notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        read: false,
        timestamp: savedNotification.createdAt || new Date(),
      }, userId);
    } catch (error) {
      console.error("Failed to send notification:", error);
      // We don't throw here to avoid failing the main business logic if notifications fail
    }
  }
}

