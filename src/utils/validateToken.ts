import jwt from "jsonwebtoken";
import _ApiResponse from "./ApiResponse";
import ApiError from "./ApiError";
import { NextFunction, Request, Response } from "express";
import { config } from "../config";

const validateToken = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const fromCookie = req.cookies?.token;
  const fromHeader = req.headers.Cookie;
  const token = fromCookie || fromHeader;

  if (!token) {
    throw new ApiError(401, "token not found");
  }

  if (!config.jwt_secret) {
    throw new ApiError(401, "jwt not defined in config");
  }

  try {
    const _verified = jwt.verify(token, config.jwt_secret);
    next();
  } catch (_error) {
    throw new ApiError(401, "token is invalid or expired");
  }
};

export default validateToken;
