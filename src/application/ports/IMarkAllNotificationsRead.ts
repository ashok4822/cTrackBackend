export interface IMarkAllNotificationsRead {
    execute(userId: string): Promise<void>;
}
