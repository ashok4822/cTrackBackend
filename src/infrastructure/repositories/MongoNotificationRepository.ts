import { INotificationRepository, INotification, INotificationData } from "../../domain/repositories/INotificationRepository";
import { NotificationModel } from "../models/NotificationModel";

export class MongoNotificationRepository implements INotificationRepository {
    async findByUserId(userId: string): Promise<INotification[]> {
        const docs = await NotificationModel.find({ userId }).sort({ createdAt: -1 }).limit(50);
        return docs.map(this._toEntity);
    }

    async create(data: INotificationData): Promise<INotification> {
        const doc = await NotificationModel.create({
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            link: data.link,
        });
        return this._toEntity(doc);
    }

    async markRead(notificationId: string, userId: string): Promise<void> {
        await NotificationModel.findOneAndUpdate(
            { _id: notificationId, userId },
            { read: true }
        );
    }

    async markAllRead(userId: string): Promise<void> {
        await NotificationModel.updateMany({ userId, read: false }, { read: true });
    }

    async deleteByIdAndUser(notificationId: string, userId: string): Promise<void> {
        await NotificationModel.findOneAndDelete({ _id: notificationId, userId });
    }

    private _toEntity(doc: InstanceType<typeof NotificationModel>): INotification {
        return {
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            type: doc.type as INotification["type"],
            title: doc.title,
            message: doc.message,
            link: doc.link,
            read: doc.read,
            createdAt: doc.createdAt,
        };
    }
}
