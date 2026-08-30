import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import helmet from "helmet";
import { connectDB } from "./src/infrastructure/database/MongoConnection";

import { HttpStatus } from "./src/shared/constants/HttpStatus";
import { ResponseMessage } from "./src/shared/constants/ResponseMessage";
import { globalLimiter } from "./src/presentation/middlewares/rateLimiter";
import { ApiResponse } from "./src/shared/utils/ApiResponse";
import { appConfig } from "./src/infrastructure/config/appConfig";
import { globalErrorHandler } from "./src/presentation/middlewares/errorHandler";

// DI Container
import { initializeAppContainer } from "./src/infrastructure/di/AppContainer";
import { createApiRouter } from "./src/presentation/routes/apiRoutes";

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// Dependency Injection Container
// ─────────────────────────────────────────────────────────────────────────────
const appContainer = initializeAppContainer(appConfig);
const { services } = appContainer;

// Connect DB
connectDB(appConfig.get("MONGODB_URI"));

const app = express();
const httpServer = createServer(app);
const PORT = appConfig.get("PORT") || 5001;

// Initialize Socket.io
services.socketService.initialize(httpServer, appConfig);

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

//Routes
app.use("/api", createApiRouter(appContainer));

app.get("/health", (req, res) => {
  res
    .status(HttpStatus.OK)
    .json(
      ApiResponse.success({ status: "ok" }, ResponseMessage.SERVER_HEALTHY),
    );
});

// 404 Not Found Handler
app.use((req, res) => {
  res
    .status(HttpStatus.NOT_FOUND)
    .json(ApiResponse.error(ResponseMessage.NOT_FOUND));
});

// Global Error Handler
app.use(globalErrorHandler);

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
