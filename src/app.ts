import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { userRouter } from "./routes/userRoutes";
import {
  globalErrorHandler,
  globalResponseHandler
} from "./utils/globalhandler";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.cors_origin,
    credentials: true
  })
);

// routes
app.use("/user", userRouter);

// custom middlewares
app.use(globalResponseHandler);
app.use(globalErrorHandler);
export default app;
