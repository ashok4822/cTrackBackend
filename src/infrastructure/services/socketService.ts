import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";

class SocketService {
    private static instance: SocketService;
    private io: SocketServer | null = null;

    private constructor() { }

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
                    const allowedOrigins = ["https://www.caryo.store"];
                    if (allowedOrigins.includes(origin)) {
                        return callback(null, true);
                    }
                    callback(new Error("Not allowed by CORS"));
                },
                credentials: true,
            },
        });

        this.io.on("connection", (socket) => {
            console.log(`New client connected: ${socket.id}`);

            // Join a private room for the user
            socket.on("join", (userId: string) => {
                if (userId) {
                    socket.join(userId);
                    console.log(`User ${userId} joined room ${userId}`);
                }
            });

            socket.on("disconnect", () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });

        return this.io;
    }

    public getIO(): SocketServer {
        if (!this.io) {
            throw new Error("Socket.io not initialized!");
        }
        return this.io;
    }

    public emitKPIUpdate(data: any) {
        if (this.io) {
            this.io.emit("kpi_update", data);
        }
    }

    public emitActivity(activity: any) {
        if (this.io) {
            this.io.emit("new_activity", activity);
        }
    }

    public emitAlert(alert: any, userId?: string) {
        if (this.io) {
            if (userId) {
                this.io.to(userId).emit("new_alert", alert);
            } else {
                this.io.emit("new_alert", alert);
            }
        }
    }

    public emitNotification(notification: any, userId: string) {
        if (this.io) {
            this.io.to(userId).emit("notification", notification);
        }
    }
}

export const socketService = SocketService.getInstance();
