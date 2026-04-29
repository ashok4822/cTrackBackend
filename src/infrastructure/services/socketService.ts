import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

interface SocketKPIUpdate {
// ... rest of file (using replace_file_content with TargetContent)
  type: string;
  action?: string;
  id?: string | string[];
  data?: unknown;
}

interface SocketActivity {
  type: string;
  title: string;
  description: string;
  timestamp: Date;
}

interface SocketAlert {
  type: "success" | "alert" | "info" | "warning";
  title: string;
  message: string;
  id: string;
}

interface SocketNotification {
  id: string;
  type: "success" | "alert" | "info" | "warning";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  timestamp: Date;
}

class SocketService {
  private static _instance: SocketService;
  private _io: SocketServer | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService._instance) {
      SocketService._instance = new SocketService();
    }
    return SocketService._instance;
  }

  public initialize(httpServer: HttpServer): SocketServer {
    this._io = new SocketServer(httpServer, {
      cors: {
        origin: (origin, callback) => {
          // Allow any localhost origin
          if (!origin || origin.startsWith("http://localhost:")) {
            return callback(null, true);
          }
          const allowedOrigins = process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(",")
            : [];
          if (
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app")
          ) {
            return callback(null, true);
          }
          callback(new Error(ResponseMessage.NOT_ALLOWED_BY_CORS));
        },
        credentials: true,
      },
    });

    this._io.on("connection", (socket) => {
      // Join a private room for the user
      socket.on("join", (userId: string) => {
        if (userId) {
          socket.join(userId);
        }
      });

      socket.on("disconnect", () => {});
    });

    return this._io;
  }

  public getIO(): SocketServer {
    if (!this._io) {
      throw new Error(ResponseMessage.SOCKET_NOT_INITIALIZED);
    }
    return this._io;
  }

  public emitKPIUpdate(data: SocketKPIUpdate) {
    if (this._io) {
      this._io.emit("kpi_update", data);
    }
  }

  public emitActivity(activity: SocketActivity) {
    if (this._io) {
      this._io.emit("new_activity", activity);
    }
  }

  public emitAlert(alert: SocketAlert, userId?: string) {
    if (this._io) {
      if (userId) {
        this._io.to(userId).emit("new_alert", alert);
      } else {
        this._io.emit("new_alert", alert);
      }
    }
  }

  public emitNotification(notification: SocketNotification, userId: string) {
    if (this._io) {
      this._io.to(userId).emit("notification", notification);
    }
  }
}

export const socketService = SocketService.getInstance();
