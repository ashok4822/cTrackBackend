import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IDeleteNotification } from "../ports/IDeleteNotification";

export class DeleteNotification implements IDeleteNotification {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(notificationId: string, userId: string): Promise<void> {
        await this.notificationRepository.deleteByIdAndUser(notificationId, userId);
    }
}
