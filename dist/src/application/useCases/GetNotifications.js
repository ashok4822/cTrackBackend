"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNotifications = void 0;
const NotificationMapper_1 = require("../mappers/NotificationMapper");
class GetNotifications {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(userId) {
        const notifications = await this.notificationRepository.findByUserId(userId);
        return NotificationMapper_1.NotificationMapper.toCollectionResponseDto(notifications);
    }
}
exports.GetNotifications = GetNotifications;
//# sourceMappingURL=GetNotifications.js.map