export interface IDeleteNotification {
    execute(notificationId: string, userId: string): Promise<void>;
}
