import mongoose, { Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config";
import { IUser as UserType } from "../types";

interface IUser extends UserType, Document {
  generateAccessAndRefreshToken(): {
    accessToken: string;
    refreshToken: string;
  };
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate access + refresh token
userSchema.methods.generateAccessAndRefreshToken = function () {
  const payload = { userId: this._id.toString(), email: this.email };

  const accessToken = jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: "20m"
  });

  const refreshToken = jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: "7d"
  });

  return { accessToken, refreshToken };
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
