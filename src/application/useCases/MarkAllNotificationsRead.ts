import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IMarkAllNotificationsRead } from "../ports/IMarkAllNotificationsRead";

export class MarkAllNotificationsRead implements IMarkAllNotificationsRead {
    constructor(private readonly _notificationRepository: INotificationRepository) { }

    async execute(userId: string): Promise<void> {
        await this._notificationRepository.markAllRead(userId);
    }
}
