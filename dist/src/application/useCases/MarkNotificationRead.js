"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkNotificationRead = void 0;
class MarkNotificationRead {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(notificationId, userId) {
        await this.notificationRepository.markRead(notificationId, userId);
    }
}
exports.MarkNotificationRead = MarkNotificationRead;
//# sourceMappingURL=MarkNotificationRead.js.map