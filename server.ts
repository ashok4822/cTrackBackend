import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/infrastructure/database/MongoConnection";
import { createAuthRouter } from "./src/presentation/routes/authRoutes";
import { userRouter } from "./src/presentation/routes/userRoutes";
import { createYardRouter } from "./src/presentation/routes/yardRoutes";
import { createShippingLineRouter } from "./src/presentation/routes/shippingLineRoutes";
import { createContainerRouter } from "./src/presentation/routes/containerRoutes";
import { createGateOperationRouter } from "./src/presentation/routes/gateOperationRoutes";
import { HttpStatus } from "./src/domain/constants/HttpStatus";
import {
  globalLimiter,
  authLimiter,
} from "./src/presentation/middlewares/rateLimiter";

dotenv.config();

//Connect DB
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // Allow any localhost origin
      if (origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }

      const allowedOrigins = [
        "https://www.caryo.store", // Added for production/staging
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Apply global rate limiter to all api routes
app.use("/api", globalLimiter);

//Routes
app.use("/api/auth", authLimiter, createAuthRouter());
app.use("/api/users", userRouter);
app.use("/api/yard", createYardRouter());
app.use("/api/shipping-lines", createShippingLineRouter());
app.use("/api/containers", createContainerRouter());
app.use("/api/gate-operations", createGateOperationRouter());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (req, res) => {
  res.status(HttpStatus.OK).json({ status: "ok" });
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`),
);
