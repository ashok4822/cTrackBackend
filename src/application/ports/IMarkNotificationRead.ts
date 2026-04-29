export interface IMarkNotificationRead {
    execute(notificationId: string, userId: string): Promise<void>;
}
