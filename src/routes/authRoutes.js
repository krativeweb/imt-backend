import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/generateTokens.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(200)
        .json({ success: false, message: "Invalid Email or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(200)
        .json({ success: false, message: "Invalid Email or Password" });

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: true,        // 🔥 ALWAYS
  sameSite: "none",    // 🔥 ALWAYS
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


    res.json({
      success: true,
      message: "Login successful",
      token: accessToken,
      user,
    });
  } catch (err) {
    next(err);
  }
});

// REFRESH ACCESS TOKEN
router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const payload = await verifyRefreshToken(refreshToken);
    const newAccessToken = await generateAccessToken(payload.id);

    res.json({
      success: true,
      token: newAccessToken,
    });
  } catch (err) {
    console.error("Refresh error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/", // must match cookie path
  });

  res.json({ success: true, message: "Logged out" });
});

export default router;
