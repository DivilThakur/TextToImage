import Mailjet from 'node-mailjet';
import dotenv from "dotenv";
dotenv.config();
import { Verification_Email_Template, Reset_Password_Email_Template } from "./EmailTemplates.js";

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

export const sendVerificationCode = async (email, verificationCode) => {
  try {
    const request = await mailjet
      .post("send", { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "divilthkr3@gmail.com", // Must be your verified Mailjet sender
              Name: "Divil Thakur"
            },
            To: [
              {
                Email: email, // This can now be anyone's email!
                Name: "User"
              }
            ],
            Subject: "Verify your email ✔",
            HTMLPart: Verification_Email_Template.replace(
              "{verificationCode}",
              verificationCode
            ),
          }
        ]
      });

    console.log("Email sent successfully. Status:", request.body.Messages[0].Status);
  } catch (error) {
    console.error("Mailjet Error (Verification):", error.statusCode, error.message);
  }
};

export const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    const request = await mailjet
      .post("send", { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "divilthkr3@gmail.com",
              Name: "Divil Thakur"
            },
            To: [
              {
                Email: email,
                Name: "User"
              }
            ],
            Subject: "Reset Your Password ✔",
            HTMLPart: Reset_Password_Email_Template.replace(/{resetLink}/g, resetLink),
          }
        ]
      });

    console.log("Reset email sent successfully. Status:", request.body.Messages[0].Status);
  } catch (error) {
    console.error("Mailjet Error (Reset):", error.statusCode, error.message);
  }
};