import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import razorpay from "razorpay";
import transactionModel from "../models/transacitonModel.js";
import dotenv from "dotenv";
import crypto from "crypto";
import {
  sendResetPasswordEmail,
  sendVerificationCode,
} from "../middlewares/OtpSetup.js";
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be atleast of 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const userData = {
      name,
      email,
      password: hashedPassword,
      verificationCode,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    sendVerificationCode(email, verificationCode);

    res.json({
      success: true,
      user: { name: user.name },
      message: "Signin successfull",
    });
  } catch (error) {
    console.log("error in register user controller ", error);
    res.json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const verificationCode = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = new Date(Date.now() + 5 * 60 * 1000);

      await user.save();

      sendVerificationCode(email, verificationCode);

      res.json({
        success: true,
        user: { name: user.name },
        message: "Login successfull",
      });
    } else {
      return res.json({ success: false, message: "Incorrect password" });
    }
  } catch (error) {
    console.log("error in login user controller ", error);
    return res.json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000;

    user.resetToken = token;
    user.resetTokenExpires = expiry;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendResetPasswordEmail(email, resetLink);

    return res.status(200).json({
      success: true,
      message: "Reset link sent to email (check console in dev mode)",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { Code } = req.body;
    const user = await userModel.findOne({
      verificationCode: Code,
    });

    if (!user) {
      res.json({ success: false, message: "Invalid or Expired Code" });
    }

    if (
      !user.verificationCodeExpires ||
      user.verificationCodeExpires < Date.now()
    ) {
      return res.json({
        success: false,
        message: "Verification code has expired",
      });
    }

    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.status(200).json({
      success: true,
      token,
      user: { name: user.name },
      message: "Email verified succesfully",
    });
  } catch (error) {
    console.log("error in verifyotp controller", error);
    return res.json({ success: false, message: error.message });
  }
};

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.verificationCodeExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendVerificationCode(email, verificationCode);

    res.status(200).json({
      success: true,
      message: "Verification email resent successfully",
    });
  } catch (error) {
    console.error("Resend Email Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const userCredits = async (req, res) => {
  try {
    const user = await userModel.findById(req.user);
    if (user) {
      res.json({
        success: true,
        credits: user.creditBalance,
        user: { name: user.name },
      });
    }
  } catch (error) {
    console.log("error in user credit controller ", error);
    res.json({ success: false, message: error.message });
  }
};

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const paymentRazorpay = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user;

    const userData = await userModel.findById(userId);

    if (!userId || !planId) {
      return res.json({ success: false, message: "Missing Details" });
    }

    let credits, plan, amount, date;
    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;

      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;

      default:
        return res.json({ success: false, message: "Plan not found" });
    }
    date = Date.now();
    const trasactionData = {
      userId,
      plan,
      amount,
      credits,
      date,
    };

    const newTransaction = await transactionModel.create(trasactionData);
    const options = {
      amount: amount * 100 * 85,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id,
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log("error", error);
    res.json({ success: false, message: error.message });
  }
};

export const verfiyPayment = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      const transactionData = await transactionModel.findById(
        orderInfo.receipt
      );
      if (transactionData.payment) {
        return res.json({ success: false, message: "payment failed" });
      }
      const userData = await userModel.findById(transactionData.userId);
      const creditBalance = userData.creditBalance + transactionData.credits;
      await userModel.findByIdAndUpdate(userData._id, { creditBalance });
      await transactionModel.findByIdAndUpdate(transactionData._id, {
        payment: true,
      });

      res.json({ success: true, message: "credits added" });
    } else {
      res.json({ success: false, message: "payment failed" });
    }
  } catch (error) {}
};
