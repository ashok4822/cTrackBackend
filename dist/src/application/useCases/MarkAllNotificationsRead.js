"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAllNotificationsRead = void 0;
class MarkAllNotificationsRead {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(userId) {
        await this.notificationRepository.markAllRead(userId);
    }
}
exports.MarkAllNotificationsRead = MarkAllNotificationsRead;
//# sourceMappingURL=MarkAllNotificationsRead.js.map