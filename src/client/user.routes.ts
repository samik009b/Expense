import { Router } from "express";
import { userRegisterHandler, userLoginHandler, userProfileHandler } from "./user.controller";
import validateToken from "../utils/validateToken";

const router = Router();

router.post("/register", userRegisterHandler);
router.post("/login", userLoginHandler);
router.get("/profile", validateToken, userProfileHandler);

export const userRouter = router;
