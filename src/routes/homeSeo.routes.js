import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import HomeSeo from "../models/HomeSeo.js";

const router = express.Router();

/* ---------------------------------
   __dirname FOR ES MODULE
--------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------
   UPLOAD DIRECTORY (src/uploads/banner)
--------------------------------- */
const uploadDir = path.join(__dirname, "../uploads/banner");

/* ensure upload directory exists */
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ---------------------------------
   MULTER CONFIG
--------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `banner-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* =====================================================
   FETCH ALL HOME SEO
===================================================== */
router.get("/", async (req, res) => {
  try {
    const data = await HomeSeo.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   FETCH SINGLE HOME SEO
===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const seo = await HomeSeo.findById(req.params.id);
    if (!seo) return res.status(404).json({ message: "SEO record not found" });
    res.json({ success: true, data: seo });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   UPDATE HOME SEO + IMAGE
===================================================== */
router.put("/:id", upload.single("banner_image"), async (req, res) => {
  try {
    const seo = await HomeSeo.findById(req.params.id);
    if (!seo) return res.status(404).json({ message: "SEO record not found" });

    /* delete old image */
    if (req.file && seo.banner_image) {
      const oldPath = path.join(process.cwd(), seo.banner_image);
      fs.unlink(oldPath, () => {});
    }

    /* update fields */
    seo.meta_title = req.body.meta_title;
    seo.meta_description = req.body.meta_description;
    seo.meta_keywords = req.body.meta_keywords;
    seo.meta_canonical = req.body.meta_canonical;
    seo.banner_text = req.body.banner_text;

    /* save relative path */
    if (req.file) {
      seo.banner_image = `uploads/banner/${req.file.filename}`;
    }

    await seo.save();

    res.json({
      success: true,
      message: "Home SEO updated successfully",
      data: seo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
