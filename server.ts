import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/infrastructure/database/MongoConnection";
import { createAuthRouter } from "./src/presentation/routes/authRoutes";
import { userRouter } from "./src/presentation/routes/userRoutes";
import { HttpStatus } from "./src/domain/constants/HttpStatus";

dotenv.config();

//Connect DB
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8080",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/auth", createAuthRouter());
app.use("/api/users", userRouter);

app.get("/health", (req, res) => {
  res.status(HttpStatus.OK).json({ status: "ok" });
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`),
);
