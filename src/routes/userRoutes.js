import express from "express";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
