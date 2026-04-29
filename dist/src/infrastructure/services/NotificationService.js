"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const NotificationModel_1 = require("../models/NotificationModel");
const socketService_1 = require("./socketService");
class NotificationService {
    async send(userId, data) {
        try {
            const notification = await NotificationModel_1.NotificationModel.create({
                userId,
                ...data
            });
            socketService_1.socketService.emitNotification({
                ...data,
                id: notification._id.toString(),
                read: false,
                timestamp: notification.createdAt || new Date()
            }, userId);
        }
        catch (error) {
            console.error("Failed to send notification via NotificationService:", error);
            // Non-fatal error
        }
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=NotificationService.js.map