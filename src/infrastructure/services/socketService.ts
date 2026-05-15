import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { ISocketService, SocketKPIUpdate, SocketActivity, SocketAlert, SocketNotification } from "../../application/services/ISocketService";
import { IConfigService } from "../../application/services/IConfigService";

export class SocketService implements ISocketService {
  private _io: SocketServer | null = null;

  constructor() {}

  public initialize(httpServer: HttpServer, config: IConfigService): SocketServer {
    this._io = new SocketServer(httpServer, {
      cors: {
        origin: (origin, callback) => {
          // Allow any localhost origin
          if (!origin || origin.startsWith("http://localhost:")) {
            return callback(null, true);
          }
          const allowedOrigins = config.get("CORS_ORIGIN")
            ? config.get("CORS_ORIGIN").split(",")
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
