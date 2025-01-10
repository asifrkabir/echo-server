/* eslint-disable no-console */
import sgMail from "@sendgrid/mail";
import config from "../config";

// Initialize SendGrid
sgMail.setApiKey(config.sendgrid_api_key as string);

export const sendResetPasswordEmail = async (to: string, resetLink: string) => {
  const mailData = {
    to,
    from: config.sendgrid_email as string,
    subject: "Reset Your Password | Echo",
    html: `
      <p>Hi,</p>
      <p>You requested to reset your password for your Echo account.</p>
      <p>Click the link below to reset your password. This link will expire in 10 minutes:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Thanks,<br>Echo Team</p>
    `,
  };

  try {
    await sgMail.send(mailData);
    console.log(`Reset password email sent to ${to}`);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw error;
  }
};
