import express from "express";
import {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,
  verfiyPayment,
  verifyOtp,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
} from "../controllers/userController.js";
import { userAuth } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/resend-verification", resendVerificationEmail);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

userRouter.get("/credits", userAuth, userCredits);
userRouter.post("/razor-pay", userAuth, paymentRazorpay);
userRouter.post("/verify-pay", verfiyPayment);

export default userRouter;
