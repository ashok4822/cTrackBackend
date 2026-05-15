export interface SocketKPIUpdate {
  type: string;
  action?: string;
  id?: string | string[];
  data?: unknown;
}

export interface SocketActivity {
  type: string;
  title: string;
  description: string;
  timestamp: Date;
}

export interface SocketAlert {
  type: "success" | "alert" | "info" | "warning";
  title: string;
  message: string;
  id: string;
}

export interface SocketNotification {
  id: string;
  type: "success" | "alert" | "info" | "warning";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  timestamp: Date;
}

export interface ISocketService {
  emitKPIUpdate(data: SocketKPIUpdate): void;
  emitActivity(activity: SocketActivity): void;
  emitAlert(alert: SocketAlert, userId?: string): void;
  emitNotification(notification: SocketNotification, userId: string): void;
}
