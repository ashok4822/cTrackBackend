// ─── Notification DTOs ────────────────────────────────────────────────────────

export type NotificationType = "success" | "error" | "info" | "warning" | "alert";

export interface NotificationResponseDto {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
  timestamp: Date;
}

export interface NotificationCollectionResponseDto {
  items: NotificationResponseDto[];
  total: number;
}
