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
    let message = "internal server error";
    let data = null;

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        data = err.data;
    } else {
        console.error("what kind of sorcery is this ? --> ", err);
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        data: data
    });
};
