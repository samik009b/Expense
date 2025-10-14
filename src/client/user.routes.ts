import { Router } from "express";
import { userRegisterHandler, userLoginHandler, userProfileHandler } from "./user.controller";
import validateToken from "../utils/validateToken";

const router = Router();

router.get("/profile", validateToken, userProfileHandler);
router.post("/register", userRegisterHandler);
router.post("/login", userLoginHandler);

export const userRouter = router;
