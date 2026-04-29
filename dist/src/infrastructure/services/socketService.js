"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = void 0;
const socket_io_1 = require("socket.io");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class SocketService {
    static _instance;
    _io = null;
    constructor() { }
    static getInstance() {
        if (!SocketService._instance) {
            SocketService._instance = new SocketService();
        }
        return SocketService._instance;
    }
    initialize(httpServer) {
        this._io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: (origin, callback) => {
                    // Allow any localhost origin
                    if (!origin || origin.startsWith("http://localhost:")) {
                        return callback(null, true);
                    }
                    const allowedOrigins = process.env.CORS_ORIGIN
                        ? process.env.CORS_ORIGIN.split(",")
                        : [];
                    if (allowedOrigins.includes(origin) ||
                        origin.endsWith(".vercel.app")) {
                        return callback(null, true);
                    }
                    callback(new Error(ResponseMessage_1.ResponseMessage.NOT_ALLOWED_BY_CORS));
                },
                credentials: true,
            },
        });
        this._io.on("connection", (socket) => {
            // Join a private room for the user
            socket.on("join", (userId) => {
                if (userId) {
                    socket.join(userId);
                }
            });
            socket.on("disconnect", () => { });
        });
        return this._io;
    }
    getIO() {
        if (!this._io) {
            throw new Error(ResponseMessage_1.ResponseMessage.SOCKET_NOT_INITIALIZED);
        }
        return this._io;
    }
    emitKPIUpdate(data) {
        if (this._io) {
            this._io.emit("kpi_update", data);
        }
    }
    emitActivity(activity) {
        if (this._io) {
            this._io.emit("new_activity", activity);
        }
    }
    emitAlert(alert, userId) {
        if (this._io) {
            if (userId) {
                this._io.to(userId).emit("new_alert", alert);
            }
            else {
                this._io.emit("new_alert", alert);
            }
        }
    }
    emitNotification(notification, userId) {
        if (this._io) {
            this._io.to(userId).emit("notification", notification);
        }
    }
}
exports.socketService = SocketService.getInstance();
//# sourceMappingURL=socketService.js.map