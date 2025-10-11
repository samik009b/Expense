import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { userRouter } from "./routes/userRoutes";
import {
  globalErrorHandler,
  globalResponseHandler,
} from "./utils/globalhandler";

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.cors_origin,
    credentials: true,
  })
);

// ===== Routes =====
app.use("/user", userRouter);

app.use(globalResponseHandler); // 2. Handle ApiResponse (optional)
app.use(globalErrorHandler); // 3. Handle all errors

export default app;
