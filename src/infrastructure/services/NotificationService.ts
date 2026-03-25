import { INotificationService } from "../../application/services/INotificationService";
import { NotificationModel } from "../models/NotificationModel";
import { socketService } from "./socketService";

export class NotificationService implements INotificationService {
    async send(userId: string, data: {
        type: "success" | "alert" | "info" | "warning";
        title: string;
        message: string;
        link?: string;
    }): Promise<void> {
        try {
            const notification = await NotificationModel.create({
                userId,
                ...data
            });

            socketService.emitNotification({
                ...data,
                id: notification._id.toString(),
                read: false,
                timestamp: notification.createdAt || new Date()
            }, userId);
        } catch (error) {
            console.error("Failed to send notification via NotificationService:", error);
            // Non-fatal error
        }
    }
}
