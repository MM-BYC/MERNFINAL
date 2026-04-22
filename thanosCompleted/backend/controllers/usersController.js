const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require("../config/emailService");

function checkToken(req, res) {
  console.log("req.user", req.user);
  res.json(req.exp);
}

function createJWT(user) {
  return jwt.sign({ user }, process.env.SECRET, { expiresIn: "24h" });
}

async function create(req, res) {
  try {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    let user = await User.create({ ...req.body, verificationToken });
    await sendVerificationEmail(user.email, verificationToken);
    res.json({ message: "Account created! Please check your email to verify your account." });
  } catch (error) {
    console.log("SIGNUP ERROR:", error.code, error.message);
    const message = error.code === 11000 ? "Email already exists" : "Sign Up Failed";
    res.status(400).json({ message });
  }
}

async function verifyEmail(req, res) {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).json({ message: "Invalid or expired verification link." });
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, `${user.firstname} ${user.lastname}`);
    res.json({ message: "Email verified! You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Verification failed." });
  }
}

async function login(req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Invalid email or password." });
    if (!user.isVerified) return res.status(403).json({ message: "Please verify your email before logging in." });
    let match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password." });
    res.json(createJWT(user));
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed." });
  }
}

async function forgotPassword(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({ message: "If that email exists, a reset link has been sent." });
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    await sendPasswordResetEmail(user.email, token);
    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error.message, error.response?.body);
    res.status(500).json({ message: "Something went wrong." });
  }
}

async function resetPassword(req, res) {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Reset link is invalid or has expired." });
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Password reset failed." });
  }
}

module.exports = { create, login, checkToken, verifyEmail, forgotPassword, resetPassword };
