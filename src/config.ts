import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  mongo_url: process.env.MONGO_URL,
  cors_origin: process.env.CORS_ORIGIN,
  jwt_secret: process.env.JWT_SECRET
};

export const config = Object.freeze(_config);
