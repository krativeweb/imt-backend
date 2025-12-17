import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import HomeAbout from "../models/HomeAbout.js";

const router = express.Router();

/* ---------------------------------
   UPLOAD CONFIG (FIXED PATH)
--------------------------------- */
const uploadDir = path.join(process.cwd(), "src/uploads/about");

// ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `about-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  },
});

/* =====================================================
   GET ABOUT US (HOME)
===================================================== */
router.get("/", async (req, res) => {
  try {
    const about = await HomeAbout.findOne();
    return res.status(200).json(about || {});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch About Us",
    });
  }
});

/* =====================================================
   UPDATE ABOUT US (HOME)
===================================================== */
router.put("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;

    let about = await HomeAbout.findOne();

    // ✅ SAVE RELATIVE PATH IN DB (IMPORTANT)
    const imagePath = req.file
      ? `/uploads/about/${req.file.filename}`
      : about?.image || "";

    if (!about) {
      about = await HomeAbout.create({
        title,
        description,
        image: imagePath,
      });
    } else {
      about.title = title;
      about.description = description;
      about.image = imagePath;
      await about.save();
    }

    return res.status(200).json({
      success: true,
      message: "About Us updated successfully",
      data: about,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update About Us",
    });
  }
});

export default router;
