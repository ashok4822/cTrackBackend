import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import helmet from "helmet";
import { connectDB } from "./src/infrastructure/database/MongoConnection";
import { createAuthRouter } from "./src/presentation/routes/authRoutes";
import { createUserRouter } from "./src/presentation/routes/userRoutes";
import { createYardRouter } from "./src/presentation/routes/yardRoutes";
import { createShippingLineRouter } from "./src/presentation/routes/shippingLineRoutes";
import { createContainerRouter } from "./src/presentation/routes/containerRoutes";
import { createGateOperationRouter } from "./src/presentation/routes/gateOperationRoutes";
import { createVehicleRouter } from "./src/presentation/routes/vehicleRoutes";
import { createEquipmentRouter } from "./src/presentation/routes/equipmentRoutes";
import { createBillingRouter } from "./src/presentation/routes/billingRoutes";
import { createContainerRequestRouter } from "./src/presentation/routes/containerRequestRoutes";
import { createPDARouter } from "./src/presentation/routes/pdaRoutes";
import { createDashboardRouter } from "./src/presentation/routes/dashboardRoutes";
import { createNotificationRouter } from "./src/presentation/routes/notificationRoutes";
import { createSupportRouter } from "./src/presentation/routes/supportRoutes";
import { HttpStatus } from "./src/shared/constants/HttpStatus";
import { ResponseMessage } from "./src/shared/constants/ResponseMessage";
import { SocketService } from "./src/infrastructure/services/socketService";
import {
  globalLimiter,
  authLimiter,
} from "./src/presentation/middlewares/rateLimiter";
import { MongoAuditLogRepository } from "./src/infrastructure/repositories/MongoAuditLogRepository";
import { AuditLogHandler } from "./src/infrastructure/events/AuditLogHandler";
import { EquipmentHistoryRepository } from "./src/infrastructure/repositories/EquipmentHistoryRepository";
import { EquipmentHistoryHandler } from "./src/infrastructure/events/EquipmentHistoryHandler";
import { ContainerHistoryRepository } from "./src/infrastructure/repositories/ContainerHistoryRepository";
import { ContainerHistoryHandler } from "./src/infrastructure/events/ContainerHistoryHandler";
import { ChargeHistoryRepository } from "./src/infrastructure/repositories/ChargeHistoryRepository";
import { ChargeHistoryHandler } from "./src/infrastructure/events/ChargeHistoryHandler";
import { SocketActivityHandler } from "./src/infrastructure/events/SocketActivityHandler";
import { YardManagerHandler } from "./src/infrastructure/events/YardManagerHandler";
import { BillingSyncHandler } from "./src/infrastructure/events/BillingSyncHandler";
import { ContainerRequestSyncHandler } from "./src/infrastructure/events/ContainerRequestSyncHandler";
import { BillRepository } from "./src/infrastructure/repositories/BillRepository";
import { BlockRepository } from "./src/infrastructure/repositories/BlockRepository";
import { ContainerRequestRepository } from "./src/infrastructure/repositories/ContainerRequestRepository";
import { ApiResponse } from "./src/shared/utils/ApiResponse";
import { eventBus } from "./src/infrastructure/events/EventEmitterBus";
import { appConfig } from "./src/infrastructure/config/appConfig";
// Shared infrastructure — created once, injected everywhere
import { JwtTokenService } from "./src/infrastructure/services/JwtTokenService";
import { SocketNotificationService } from "./src/infrastructure/services/SocketNotificationService";
import { ITokenService } from "./src/application/services/ITokenService";
import { INotificationService } from "./src/application/services/INotificationService";
import { createUploadMiddleware } from "./src/infrastructure/services/UploadService";

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// Composition Root — all shared infrastructure instances created and owned here
// ─────────────────────────────────────────────────────────────────────────────
// SocketService is typed as the concrete class here only for bootstrap (initialize()),
// which is a composition-root-only concern. All downstream consumers receive ISocketService.
const socketService = new SocketService();

// Initialize Event Handlers
const auditLogRepository = new MongoAuditLogRepository();
new AuditLogHandler(auditLogRepository, eventBus);

const equipmentHistoryRepository = new EquipmentHistoryRepository();
new EquipmentHistoryHandler(equipmentHistoryRepository, eventBus);

const containerHistoryRepository = new ContainerHistoryRepository();
new ContainerHistoryHandler(containerHistoryRepository, eventBus);

const chargeHistoryRepository = new ChargeHistoryRepository();
new ChargeHistoryHandler(chargeHistoryRepository, eventBus);

new SocketActivityHandler(eventBus, socketService);

const blockRepository = new BlockRepository();
new YardManagerHandler(blockRepository, eventBus);

const billRepositoryForSync = new BillRepository();
new BillingSyncHandler(billRepositoryForSync, eventBus);

const requestRepository = new ContainerRequestRepository();
new ContainerRequestSyncHandler(requestRepository, eventBus);

//Connect DB
connectDB(appConfig.get("MONGODB_URI"));

const app = express();
const httpServer = createServer(app);
const PORT = appConfig.get("PORT") || 5001;

// Initialize Socket.io
socketService.initialize(httpServer, appConfig);

const tokenService: ITokenService = new JwtTokenService();
const notificationService: INotificationService = new SocketNotificationService(socketService);
const upload = createUploadMiddleware(appConfig);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // Allow any localhost origin
      if (origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }

      const allowedOrigins = appConfig.get("CORS_ORIGIN")
        ? appConfig.get("CORS_ORIGIN").split(",")
        : [];

      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      callback(new Error(ResponseMessage.NOT_ALLOWED_BY_CORS));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Apply global rate limiter to all api routes
app.use("/api", globalLimiter);

//Routes — all factories receive injected interfaces, not concrete singletons
app.use("/api/auth", authLimiter, createAuthRouter(tokenService, appConfig, eventBus));
app.use("/api/users", createUserRouter(tokenService, appConfig, eventBus, upload));
app.use("/api/yard", createYardRouter(tokenService, appConfig, eventBus));
app.use("/api/shipping-lines", createShippingLineRouter(tokenService, appConfig, eventBus));
app.use("/api/containers", createContainerRouter(tokenService, appConfig, eventBus));
app.use("/api/gate-operations", createGateOperationRouter(tokenService, appConfig, eventBus));
app.use("/api/vehicles", createVehicleRouter(tokenService, appConfig));
app.use("/api/equipment", createEquipmentRouter(tokenService, appConfig, eventBus, notificationService));
app.use("/api/billing", createBillingRouter(tokenService, appConfig, eventBus, notificationService));
app.use("/api/container-requests", createContainerRequestRouter(tokenService, appConfig, eventBus, notificationService));
app.use("/api/pda", createPDARouter(tokenService, appConfig));
app.use("/api/dashboard", createDashboardRouter(tokenService, appConfig));
app.use("/api/notifications", createNotificationRouter(tokenService, appConfig));
app.use("/api/support", createSupportRouter(tokenService, appConfig));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (req, res) => {
  res.status(HttpStatus.OK).json(ApiResponse.success({ status: "ok" }, ResponseMessage.SERVER_HEALTHY));
});

interface HttpError extends Error {
  status?: number;
}

// Global Error Handler
app.use(
  (
    err: HttpError,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Global Error Handler caught an error:", err);
    const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || ResponseMessage.INTERNAL_SERVER_ERROR;
    const errorDetails = appConfig.get("NODE_ENV") === "development" ? err : {};
    
    res.status(status).json(ApiResponse.error(message, errorDetails));
  },
);

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
