require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM = process.env.SENDGRID_FROM;
const CLIENT_URL = process.env.CLIENT_URL;

async function sendVerificationEmail(toEmail, token) {
  const link = `${CLIENT_URL}/verify/${token}`;
  await sgMail.send({
    to: toEmail,
    from: FROM,
    subject: "Verify your email address",
    html: `
      <h2>Welcome!</h2>
      <p>Thanks for signing up. Please verify your email by clicking the link below:</p>
      <a href="${link}" style="background:#4a90e2;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}

async function sendWelcomeEmail(toEmail, name) {
  await sgMail.send({
    to: toEmail,
    from: FROM,
    subject: "Welcome to the Notes App!",
    html: `
      <h2>Hi ${name}, welcome aboard!</h2>
      <p>Your account has been verified. You can now log in and start using the app.</p>
      <a href="${CLIENT_URL}" style="background:#4a90e2;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Go to App</a>
    `,
  });
}

async function sendPasswordResetEmail(toEmail, token) {
  const link = `${CLIENT_URL}/reset-password/${token}`;
  await sgMail.send({
    to: toEmail,
    from: FROM,
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${link}" style="background:#4a90e2;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Reset Password</a>
      <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
    `,
  });
}

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail };
