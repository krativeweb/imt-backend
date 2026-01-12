import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import HappeningsSeo from "../models/HappeningsSeo.js";

const router = express.Router();

/* ---------------------------------
   __dirname FIX (ESM)
--------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------
   UPLOAD DIRECTORY
--------------------------------- */
const uploadDir = path.join(__dirname, "../uploads/happenings-banner");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ---------------------------------
   MULTER CONFIG (IMAGE ONLY)
--------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `happenings-banner-${Date.now()}${ext}`);
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* =====================================================
   FETCH HAPPENINGS SEO (SINGLE RECORD)
===================================================== */
router.get("/", async (req, res) => {
  try {
    const seo = await HappeningsSeo.findOne().lean(); // ✅ no slug

    if (!seo) {
      return res.status(404).json({
        message: "Happenings SEO not found",
      });
    }

    res.json(seo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


/* =====================================================
   FETCH SINGLE HAPPENINGS SEO BY ID
===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const seo = await HappeningsSeo.findById(req.params.id);
    if (!seo) {
      return res.status(404).json({ message: "SEO record not found" });
    }

    res.json({ success: true, data: seo });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   UPDATE HAPPENINGS SEO (TEXT + IMAGE)
===================================================== */
router.put(
  "/:id",
  upload.single("banner_image"),
  async (req, res) => {
    try {
      const seo = await HappeningsSeo.findById(req.params.id);
      if (!seo) {
        return res.status(404).json({ message: "SEO record not found" });
      }

      /* ---------- DELETE OLD IMAGE ---------- */
      if (req.file && seo.banner_image) {
        const oldPath = path.join(process.cwd(), seo.banner_image);
        fs.unlink(oldPath, () => {});
      }

      /* ---------- UPDATE TEXT FIELDS ---------- */
      seo.meta_title = req.body.meta_title || "";
      seo.meta_description = req.body.meta_description || "";
      seo.meta_keywords = req.body.meta_keywords || "";
      seo.meta_canonical = req.body.meta_canonical || "";
      seo.banner_text = req.body.banner_text || "";

      /* ---------- SAVE NEW IMAGE ---------- */
      if (req.file) {
        seo.banner_image = `uploads/happenings-banner/${req.file.filename}`;
      }

      await seo.save();

      res.json({
        success: true,
        message: "Happenings SEO updated successfully",
        data: seo,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
