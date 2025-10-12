import mongoose, { Document } from "mongoose";
import { userType } from "../utils/schemaValidator";
import { config } from "../config";
import jwt from "jsonwebtoken";

// 1️⃣ Extend your Zod-based userType to include Mongoose document fields and methods
interface IUser extends userType, Document {
  generateJwtToken(): string;
}
// 3️⃣ Create schema with proper generics
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

// 4️⃣ Define instance method
userSchema.methods.generateJwtToken = function (): string {
  const payload = { id: this._id };
  return jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: "20m"
  });
};

// 5️⃣ Create model with IUser + IUserModel types
const User = mongoose.model<IUser>("User", userSchema);

export default User;
