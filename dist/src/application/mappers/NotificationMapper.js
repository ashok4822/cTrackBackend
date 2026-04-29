"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMapper = void 0;
class NotificationMapper {
    static toResponseDto(notification) {
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
    static toCollectionResponseDto(notifications) {
        return {
            items: notifications.map((n) => this.toResponseDto(n)),
            total: notifications.length,
        };
    }
}
exports.NotificationMapper = NotificationMapper;
//# sourceMappingURL=NotificationMapper.js.map