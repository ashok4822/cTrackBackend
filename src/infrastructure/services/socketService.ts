import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";

interface SocketKPIUpdate {
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
  private static instance: SocketService;
  private io: SocketServer | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(httpServer: HttpServer): SocketServer {
    this.io = new SocketServer(httpServer, {
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
          callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
      },
    });

    this.io.on("connection", (socket) => {
      // Join a private room for the user
      socket.on("join", (userId: string) => {
        if (userId) {
          socket.join(userId);
        }
      });

      socket.on("disconnect", () => {});
    });

    return this.io;
  }

  public getIO(): SocketServer {
    if (!this.io) {
      throw new Error("Socket.io not initialized!");
    }
    return this.io;
  }

  public emitKPIUpdate(data: SocketKPIUpdate) {
    if (this.io) {
      this.io.emit("kpi_update", data);
    }
  }

  public emitActivity(activity: SocketActivity) {
    if (this.io) {
      this.io.emit("new_activity", activity);
    }
  }

  public emitAlert(alert: SocketAlert, userId?: string) {
    if (this.io) {
      if (userId) {
        this.io.to(userId).emit("new_alert", alert);
      } else {
        this.io.emit("new_alert", alert);
      }
    }
  }

  public emitNotification(notification: SocketNotification, userId: string) {
    if (this.io) {
      this.io.to(userId).emit("notification", notification);
    }
  }
}

export const socketService = SocketService.getInstance();
