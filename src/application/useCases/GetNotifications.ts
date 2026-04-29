import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IGetNotifications } from "../ports/IGetNotifications";
import { NotificationCollectionResponseDto } from "../dto/NotificationDto";
import { NotificationMapper } from "../mappers/NotificationMapper";

export class GetNotifications implements IGetNotifications {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(userId: string): Promise<NotificationCollectionResponseDto> {
        const notifications = await this.notificationRepository.findByUserId(userId);
        return NotificationMapper.toCollectionResponseDto(notifications);
    }
}
