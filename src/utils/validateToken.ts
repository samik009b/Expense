import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "./ApiError";
import { Request, Response, NextFunction } from "express";
import { config } from "../config";

interface TokenPayload extends JwtPayload {
    userId: string;
    email?: string;
}

const validateToken = (req: Request, _res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) throw new ApiError(401, "authorization header missing or malformed");
        if (!config.jwt_secret) throw new ApiError(500, "jwt secret not defined");

        const decoded = jwt.verify(token, config.jwt_secret) as TokenPayload;
        if (!decoded.userId) throw new ApiError(401, "invalid token payload");

        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (err) {
        console.error("jwt validation Error:", err);
        throw new ApiError(401, "token is invalid or expired");
    }
};

export default validateToken;
