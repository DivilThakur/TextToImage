import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { Verification_Email_Template } from "./EmailTemplates.js";
import { Reset_Password_Email_Template } from "./EmailTemplates.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

export const sendVerificationCode = async (email, verificationCode) => {
  try {
    const info = await transporter.sendMail({
      from: '"Divil Thakur 👻" <divilthkr3@gmail.com>',
      to: email,
      subject: "Verify your email ✔",
      text: "verify your email ✔",
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ),
    });
    console.log("email send successfully ", info);
  } catch (error) {
    console.log("error in opt middleware ", error);
  }
};

export const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    const info = await transporter.sendMail({
      from: '"Divil Thakur 👻" <divilthkr3@gmail.com>',
      to: email,
      subject: "Reset Your Password ✔",
      text: "Reset your password ✔",
      html: Reset_Password_Email_Template.replace(/{resetLink}/g, resetLink),
    });
    console.log("Reset email sent successfully:", info.messageId);
  } catch (error) {
    console.log("Error sending reset email:", error);
  }
};
