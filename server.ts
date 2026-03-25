import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import helmet from "helmet";
import { connectDB } from "./src/infrastructure/database/MongoConnection";
import { createAuthRouter } from "./src/presentation/routes/authRoutes";
import { userRouter } from "./src/presentation/routes/userRoutes";
import { createYardRouter } from "./src/presentation/routes/yardRoutes";
import { createShippingLineRouter } from "./src/presentation/routes/shippingLineRoutes";
import { createContainerRouter } from "./src/presentation/routes/containerRoutes";
import { createGateOperationRouter } from "./src/presentation/routes/gateOperationRoutes";
import { createVehicleRouter } from "./src/presentation/routes/vehicleRoutes";
import { createEquipmentRouter } from "./src/presentation/routes/equipmentRoutes";
import { createBillingRouter } from "./src/presentation/routes/billingRoutes";
import containerRequestRouter from "./src/presentation/routes/containerRequestRoutes";
import { createPDARouter } from "./src/presentation/routes/pdaRoutes";
import { createDashboardRouter } from "./src/presentation/routes/dashboardRoutes";
import { createNotificationRouter } from "./src/presentation/routes/notificationRoutes";
import { createSupportRouter } from "./src/presentation/routes/supportRoutes";
import { HttpStatus } from "./src/domain/constants/HttpStatus";
import { socketService } from "./src/infrastructure/services/socketService";
import {
  globalLimiter,
  authLimiter,
} from "./src/presentation/middlewares/rateLimiter";

dotenv.config();

//Connect DB
connectDB();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5001;

// Initialize Socket.io
socketService.initialize(httpServer);

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

      const allowedOrigins = ["https://ctrack.site", "https://www.ctrack.site"];

      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Apply global rate limiter to all api routes
app.use("/api", globalLimiter);

//Routes
app.use("/api/auth", authLimiter, createAuthRouter());
app.use("/api/users", userRouter);
app.use("/api/yard", createYardRouter());
app.use("/api/shipping-lines", createShippingLineRouter());
app.use("/api/containers", createContainerRouter());
app.use("/api/gate-operations", createGateOperationRouter());
app.use("/api/vehicles", createVehicleRouter());
app.use("/api/equipment", createEquipmentRouter());
app.use("/api/billing", createBillingRouter());
app.use("/api/container-requests", containerRequestRouter);
app.use("/api/pda", createPDARouter());
app.use("/api/dashboard", createDashboardRouter());
app.use("/api/notifications", createNotificationRouter());
app.use("/api/support", createSupportRouter());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (req, res) => {
  res.status(HttpStatus.OK).json({ status: "ok" });
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
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err : {},
    });
  },
);

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
