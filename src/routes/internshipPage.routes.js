import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import InternshipPage from "../models/InternshipPage.js";

const router = express.Router();

/* ===============================
   MULTER (BANNER ONLY)
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("src", "uploads", "banner");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ===============================
   GET BY ID
================================ */
router.get("/", async (req, res) => {
  try {
    const pages = await InternshipPage.find().sort({ createdAt: -1 });
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   UPDATE BY ID
================================ */
router.put("/:id", upload.single("banner_image"), async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.banner_image = `/uploads/banner/${req.file.filename}`;
    }

    const updatedPage = await InternshipPage.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!updatedPage) {
      return res.status(404).json({ message: "Internship page not found" });
    }

    res.status(200).json({
      message: "Internship page updated successfully",
      data: updatedPage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
