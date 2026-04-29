export interface INotificationService {
  send(userId: string, notification: {
    type: "success" | "error" | "info" | "warning" | "alert";
    title: string;
    message: string;
    link?: string;
  }): Promise<void>;
}
