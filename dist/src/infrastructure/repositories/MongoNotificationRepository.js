"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoNotificationRepository = void 0;
const NotificationModel_1 = require("../models/NotificationModel");
class MongoNotificationRepository {
    async findByUserId(userId) {
        const docs = await NotificationModel_1.NotificationModel.find({ userId }).sort({ createdAt: -1 }).limit(50);
        return docs.map(this.toEntity);
    }
    async create(data) {
        const doc = await NotificationModel_1.NotificationModel.create({
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            link: data.link,
        });
        return this.toEntity(doc);
    }
    async markRead(notificationId, userId) {
        await NotificationModel_1.NotificationModel.findOneAndUpdate({ _id: notificationId, userId }, { read: true });
    }
    async markAllRead(userId) {
        await NotificationModel_1.NotificationModel.updateMany({ userId, read: false }, { read: true });
    }
    async deleteByIdAndUser(notificationId, userId) {
        await NotificationModel_1.NotificationModel.findOneAndDelete({ _id: notificationId, userId });
    }
    toEntity(doc) {
        return {
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            type: doc.type,
            title: doc.title,
            message: doc.message,
            link: doc.link,
            read: doc.read,
            createdAt: doc.createdAt,
        };
    }
}
exports.MongoNotificationRepository = MongoNotificationRepository;
//# sourceMappingURL=MongoNotificationRepository.js.map