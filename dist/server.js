"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const helmet_1 = __importDefault(require("helmet"));
const MongoConnection_1 = require("./src/infrastructure/database/MongoConnection");
const authRoutes_1 = require("./src/presentation/routes/authRoutes");
const userRoutes_1 = require("./src/presentation/routes/userRoutes");
const yardRoutes_1 = require("./src/presentation/routes/yardRoutes");
const shippingLineRoutes_1 = require("./src/presentation/routes/shippingLineRoutes");
const containerRoutes_1 = require("./src/presentation/routes/containerRoutes");
const gateOperationRoutes_1 = require("./src/presentation/routes/gateOperationRoutes");
const vehicleRoutes_1 = require("./src/presentation/routes/vehicleRoutes");
const equipmentRoutes_1 = require("./src/presentation/routes/equipmentRoutes");
const billingRoutes_1 = require("./src/presentation/routes/billingRoutes");
const containerRequestRoutes_1 = require("./src/presentation/routes/containerRequestRoutes");
const pdaRoutes_1 = require("./src/presentation/routes/pdaRoutes");
const dashboardRoutes_1 = require("./src/presentation/routes/dashboardRoutes");
const notificationRoutes_1 = require("./src/presentation/routes/notificationRoutes");
const supportRoutes_1 = require("./src/presentation/routes/supportRoutes");
const HttpStatus_1 = require("./src/shared/constants/HttpStatus");
const ResponseMessage_1 = require("./src/shared/constants/ResponseMessage");
const socketService_1 = require("./src/infrastructure/services/socketService");
const rateLimiter_1 = require("./src/presentation/middlewares/rateLimiter");
const MongoAuditLogRepository_1 = require("./src/infrastructure/repositories/MongoAuditLogRepository");
const AuditLogHandler_1 = require("./src/infrastructure/events/AuditLogHandler");
const EquipmentHistoryRepository_1 = require("./src/infrastructure/repositories/EquipmentHistoryRepository");
const EquipmentHistoryHandler_1 = require("./src/infrastructure/events/EquipmentHistoryHandler");
const ContainerHistoryRepository_1 = require("./src/infrastructure/repositories/ContainerHistoryRepository");
const ContainerHistoryHandler_1 = require("./src/infrastructure/events/ContainerHistoryHandler");
const ChargeHistoryRepository_1 = require("./src/infrastructure/repositories/ChargeHistoryRepository");
const ChargeHistoryHandler_1 = require("./src/infrastructure/events/ChargeHistoryHandler");
const SocketActivityHandler_1 = require("./src/infrastructure/events/SocketActivityHandler");
const YardManagerHandler_1 = require("./src/infrastructure/events/YardManagerHandler");
const BillingSyncHandler_1 = require("./src/infrastructure/events/BillingSyncHandler");
const ContainerRequestSyncHandler_1 = require("./src/infrastructure/events/ContainerRequestSyncHandler");
const BillRepository_1 = require("./src/infrastructure/repositories/BillRepository");
const BlockRepository_1 = require("./src/infrastructure/repositories/BlockRepository");
const ContainerRequestRepository_1 = require("./src/infrastructure/repositories/ContainerRequestRepository");
const ApiResponse_1 = require("./src/shared/utils/ApiResponse");
dotenv_1.default.config();
// Initialize Event Handlers
const auditLogRepository = new MongoAuditLogRepository_1.MongoAuditLogRepository();
new AuditLogHandler_1.AuditLogHandler(auditLogRepository);
const equipmentHistoryRepository = new EquipmentHistoryRepository_1.EquipmentHistoryRepository();
new EquipmentHistoryHandler_1.EquipmentHistoryHandler(equipmentHistoryRepository);
const containerHistoryRepository = new ContainerHistoryRepository_1.ContainerHistoryRepository();
new ContainerHistoryHandler_1.ContainerHistoryHandler(containerHistoryRepository);
const chargeHistoryRepository = new ChargeHistoryRepository_1.ChargeHistoryRepository();
new ChargeHistoryHandler_1.ChargeHistoryHandler(chargeHistoryRepository);
new SocketActivityHandler_1.SocketActivityHandler();
const blockRepository = new BlockRepository_1.BlockRepository();
new YardManagerHandler_1.YardManagerHandler(blockRepository);
const billRepositoryForSync = new BillRepository_1.BillRepository();
new BillingSyncHandler_1.BillingSyncHandler(billRepositoryForSync);
const requestRepository = new ContainerRequestRepository_1.ContainerRequestRepository();
new ContainerRequestSyncHandler_1.ContainerRequestSyncHandler(requestRepository);
//Connect DB
(0, MongoConnection_1.connectDB)();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 5001;
// Initialize Socket.io
socketService_1.socketService.initialize(httpServer);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin)
            return callback(null, true);
        // Allow any localhost origin
        if (origin.startsWith("http://localhost:")) {
            return callback(null, true);
        }
        const allowedOrigins = process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(",")
            : [];
        if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }
        callback(new Error(ResponseMessage_1.ResponseMessage.NOT_ALLOWED_BY_CORS));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Apply global rate limiter to all api routes
app.use("/api", rateLimiter_1.globalLimiter);
//Routes
app.use("/api/auth", rateLimiter_1.authLimiter, (0, authRoutes_1.createAuthRouter)());
app.use("/api/users", (0, userRoutes_1.createUserRouter)());
app.use("/api/yard", (0, yardRoutes_1.createYardRouter)());
app.use("/api/shipping-lines", (0, shippingLineRoutes_1.createShippingLineRouter)());
app.use("/api/containers", (0, containerRoutes_1.createContainerRouter)());
app.use("/api/gate-operations", (0, gateOperationRoutes_1.createGateOperationRouter)());
app.use("/api/vehicles", (0, vehicleRoutes_1.createVehicleRouter)());
app.use("/api/equipment", (0, equipmentRoutes_1.createEquipmentRouter)());
app.use("/api/billing", (0, billingRoutes_1.createBillingRouter)());
app.use("/api/container-requests", (0, containerRequestRoutes_1.createContainerRequestRouter)());
app.use("/api/pda", (0, pdaRoutes_1.createPDARouter)());
app.use("/api/dashboard", (0, dashboardRoutes_1.createDashboardRouter)());
app.use("/api/notifications", (0, notificationRoutes_1.createNotificationRouter)());
app.use("/api/support", (0, supportRoutes_1.createSupportRouter)());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.get("/health", (req, res) => {
    res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success({ status: "ok" }, ResponseMessage_1.ResponseMessage.SERVER_HEALTHY));
});
// Global Error Handler
app.use((err, req, res, _next) => {
    console.error("Global Error Handler caught an error:", err);
    const status = err.status || HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || ResponseMessage_1.ResponseMessage.INTERNAL_SERVER_ERROR;
    const errorDetails = process.env.NODE_ENV === "development" ? err : {};
    res.status(status).json(ApiResponse_1.ApiResponse.error(message, errorDetails));
});
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map