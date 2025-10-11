import { Request, Response } from "express";
import User from "../models/userModel";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import bcrypt from "bcrypt";


// register

const userRegisterHandler = async (req: Request, _res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user exists with same email OR name
  const user = await User.findOne({
    $or: [{ email: email }, { name: name }]
  });

  if (user) {
    throw new ApiError(400, "User exists with the same name or email");
  }

  const hashedPassword = await bcrypt.hash(password, 6);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword
  });

  // Send response
  throw new ApiResponse(201, newUser, "A new user has been created");
};

const userLoginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const existedUser = await User.findOne({ email });
  if (!existedUser) {
    throw new ApiError(400, "User does not exist");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existedUser.password
  );
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password");
  }

  // If you want to generate JWT:
  // const token = jwt.sign({ id: existedUser._id }, config.jwt_secret as string, { expiresIn: "7d" });

  return new ApiResponse(200, existedUser, "User logged in successfully").send(
    res
  );
};
export { userLoginHandler, userRegisterHandler };
