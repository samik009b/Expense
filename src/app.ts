import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { userRouter } from "./client/user.routes";
import { globalErrorHandler, globalResponseHandler } from "./utils/globalhandler";
import { expenseRouter } from "./expense/expense.routes";

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

/**
 * @routes user
 */
app.use("/user", userRouter);

/**
 * @routes expense
 */
app.use("/expense", expenseRouter);

// custom middlewares
app.use(globalResponseHandler);
app.use(globalErrorHandler);

export default app;
