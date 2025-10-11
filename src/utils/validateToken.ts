import jwt from "jsonwebtoken";
import ApiResponse from "./ApiResponse";
import ApiError from "./ApiError";
import { Request } from "express";
import { config } from "../config";

const validateToken = async (req: Request, _res: Response) => {
  const fromCookie = req.cookies?.token;
  const fromHeader = req.headers["Authorization"];
  const token = fromCookie || fromHeader;

  if (!token) {
    throw new ApiError(401, "token not found");
  }

  if (!config.jwt_secret) {
    throw new ApiError(201, "jwt not defined in config");
  }

  try {
    const verified = jwt.verify(token, config.jwt_secret);
    throw new ApiResponse(200, verified, "token has been verified");
  } catch (_error) {
    throw new ApiError(401, "token is invalid or expired");
  }
};

export default validateToken;
