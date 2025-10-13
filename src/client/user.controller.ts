import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "./user.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

/**
 * @description Login user
 */
const userLoginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password are required");

  const existedUser = await User.findOne({ email });
  if (!existedUser) throw new ApiError(400, "User does not exist");

  const isPasswordCorrect = await bcrypt.compare(password, existedUser.password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid password");

  const { accessToken, refreshToken } = existedUser.generateAccessAndRefreshToken();

  // Set access token in cookie for auth
  res.cookie("token", accessToken, {
    httpOnly: true,
    maxAge: 20 * 60 * 1000, // 20 minutes
    sameSite: "none",
    secure: true
  });

  return new ApiResponse(200, { accessToken, refreshToken }, "User logged in successfully").send(
    res
  );
};

/**
 * @description Register a new user
 */
const userRegisterHandler = async (req: Request, _res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) throw new ApiError(400, "All fields are required");

  const existingUser = await User.findOne({
    $or: [{ email }, { name }]
  });

  if (existingUser) throw new ApiError(400, "User exists with same name or email");
  const newUser = await User.create({ name, email, password });

  throw new ApiResponse(201, newUser, "A new user has been created");
};

/**
 * @description Fetch user profile
 */
const userProfileHandler = async (req: Request, _res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: Missing user");

  const user = await User.findById(userId).select("-password -__v").lean();
  if (!user) throw new ApiError(404, "User not found");

  throw new ApiResponse(200, user, "User profile fetched successfully");
};

export { userRegisterHandler, userLoginHandler, userProfileHandler };
