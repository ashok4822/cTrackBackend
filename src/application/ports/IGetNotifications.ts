import { NotificationCollectionResponseDto } from "../dto/NotificationDto";

export interface IGetNotifications {
    execute(userId: string): Promise<NotificationCollectionResponseDto>;
}
