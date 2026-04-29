"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketNotificationService = void 0;
const NotificationModel_1 = require("../models/NotificationModel");
const socketService_1 = require("./socketService");
class SocketNotificationService {
    async send(userId, notification) {
        try {
            // Persist to database
            const savedNotification = await NotificationModel_1.NotificationModel.create({
                userId,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                link: notification.link,
            });
            // Emit via socket
            socketService_1.socketService.emitNotification({
                id: savedNotification._id.toString(),
                type: notification.type === "error" ? "alert" : notification.type,
                title: notification.title,
                message: notification.message,
                link: notification.link,
                read: false,
                timestamp: savedNotification.createdAt || new Date(),
            }, userId);
        }
        catch (error) {
            console.error("Failed to send notification:", error);
            // We don't throw here to avoid failing the main business logic if notifications fail
        }
    }
}
exports.SocketNotificationService = SocketNotificationService;
//# sourceMappingURL=SocketNotificationService.js.map