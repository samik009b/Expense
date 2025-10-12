import {
  userRegisterHandler,
  userLoginHandler
} from "../controllers/userController";
import express from "express";

const router = express.Router();

router.post("/register", userRegisterHandler);
router.post("/login", userLoginHandler);

export const userRouter = router;
