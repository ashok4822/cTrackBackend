"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteNotification = void 0;
class DeleteNotification {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(notificationId, userId) {
        await this.notificationRepository.deleteByIdAndUser(notificationId, userId);
    }
}
exports.DeleteNotification = DeleteNotification;
//# sourceMappingURL=DeleteNotification.js.map