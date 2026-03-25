export interface INotificationService {
    send(userId: string, data: {
        type: "success" | "alert" | "info" | "warning";
        title: string;
        message: string;
        link?: string;
    }): Promise<void>;
}
