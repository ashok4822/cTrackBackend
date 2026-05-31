import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IMarkNotificationRead } from "../ports/IMarkNotificationRead";

export class MarkNotificationRead implements IMarkNotificationRead {
    constructor(private readonly _notificationRepository: INotificationRepository) { }

    async execute(notificationId: string, userId: string): Promise<void> {
        await this._notificationRepository.markRead(notificationId, userId);
    }
}
