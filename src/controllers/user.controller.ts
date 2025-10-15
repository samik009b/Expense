import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { userData } from "../types";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

/**
 * @description Login user
 * @route /user/login
 */
const userLoginHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body as userData;
    if (!email || !password) throw new ApiError(400, "email and password are required");

    const existedUser = await User.findOne({ email });
    if (!existedUser) throw new ApiError(400, "user does not exist");

    const isPasswordCorrect = await bcrypt.compare(password, existedUser.password);
    if (!isPasswordCorrect) throw new ApiError(401, "invalid password");

    const { accessToken, refreshToken } = existedUser.generateAccessAndRefreshToken();

    res.cookie("token", accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "none",
        secure: true
    });

    return new ApiResponse(200, { accessToken, refreshToken }, "User logged in successfully").send(
        res
    );
};

/**
 * @description Register a new user
 * @route /user/register
 */
const userRegisterHandler = async (req: Request, _res: Response) => {
    const { name, email, password } = req.body as userData;

    if ([name, email, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, "all fields are required");
    }
    const existingUser = await User.findOne({
        $or: [{ email }, { name }]
    });

    if (existingUser) throw new ApiError(400, "user exists with same name or email");
    const newUser = await User.create({ name, email, password });

    throw new ApiResponse(201, newUser, "a new user has been created");
};

/**
 * @description Register a new user
 * @route /user/logout
 */
const userLogoutHandler = async () => {};

/**
 * @description Fetch user profile
 * @route /user/login
 */
const userProfileHandler = async (req: Request, _res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new ApiError(401, "unauthorized: Missing user");

    const user = await User.findById(userId).select("-password -__v").lean();
    if (!user) throw new ApiError(404, "user not found");

    throw new ApiResponse(200, user, "user profile fetched successfully");
};

export { userRegisterHandler, userLoginHandler, userProfileHandler, userLogoutHandler };
