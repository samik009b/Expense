import type ms from "ms";
import { config as conf } from "dotenv";
import { IConfig } from "../types";

conf();

const _config = {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    cors_origin: process.env.CORS_ORIGIN,
    jwt_secret: process.env.JWT_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
    access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue
};

export const config = Object.freeze(_config) as IConfig;
