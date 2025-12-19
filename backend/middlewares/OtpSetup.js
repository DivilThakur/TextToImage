import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
import { Verification_Email_Template, Reset_Password_Email_Template } from "./EmailTemplates.js";


const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationCode = async (email, verificationCode) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Divil Thakur <onboarding@resend.dev>',
      to: email,
      subject: "Verify your email ✔",
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ),
    });

    if (error) throw error;
    console.log("Email sent successfully ", data.id);
  } catch (error) {
    console.log("Error in verification email middleware ", error);
  }
};

export const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Divil Thakur <onboarding@resend.dev>',
      to: email,
      subject: "Reset Your Password ✔",
      html: Reset_Password_Email_Template.replace(/{resetLink}/g, resetLink),
    });

    if (error) throw error;
    console.log("Reset email sent successfully:", data.id);
  } catch (error) {
    console.log("Error sending reset email:", error);
  }
};