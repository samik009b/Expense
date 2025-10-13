import "express";
import User from "../client/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
