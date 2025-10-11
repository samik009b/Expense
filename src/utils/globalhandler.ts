import { Request, Response, NextFunction } from "express";
import ApiError from "./ApiError";
import ApiResponse from "./ApiResponse";

export const globalResponseHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiResponse) {
    return err.send(res);
  }

  next(err);
};

export const globalErrorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let data = null;
  // Handle ApiError instances
  if (err instanceof ApiError) {
    // Handle our custom operational errors
    statusCode = err.statusCode;
    message = err.message;
    data = err.data;
  } else {
    // Handle unexpected errors
    console.error("Unexpected Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    data: data
  });
};
