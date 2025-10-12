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

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    data = err.data;
  } else {
    // error : 500
    console.error("Unexpected Error:", err);
  }

  // sending response as json
  res.status(statusCode).json({
    success: false,
    message: message,
    data: data
  });
};
