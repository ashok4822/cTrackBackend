export interface INotificationData {
    userId: string;
    type: "success" | "error" | "info" | "warning" | "alert";
    title: string;
    message: string;
    link?: string;
}

export interface INotification extends INotificationData {
    id: string;
    read: boolean;
    createdAt: Date;
}

export interface INotificationRepository {
    findByUserId(userId: string): Promise<INotification[]>;
    create(data: INotificationData): Promise<INotification>;
    markRead(notificationId: string, userId: string): Promise<void>;
    markAllRead(userId: string): Promise<void>;
    deleteByIdAndUser(notificationId: string, userId: string): Promise<void>;
}
