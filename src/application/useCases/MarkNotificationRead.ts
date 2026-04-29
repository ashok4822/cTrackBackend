import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IMarkNotificationRead } from "../ports/IMarkNotificationRead";

export class MarkNotificationRead implements IMarkNotificationRead {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(notificationId: string, userId: string): Promise<void> {
        await this.notificationRepository.markRead(notificationId, userId);
    }
}
