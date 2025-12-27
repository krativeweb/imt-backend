import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import FacultyDetailsSEO from "../models/FacultyPagedetailsSEO.js";

const router = express.Router();

/* ----------------------------------------------------
   UPLOAD DIRECTORY
   Path: src/uploads/faculty-details
---------------------------------------------------- */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "faculty-details"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created upload folder:", uploadDir);
}

/* ----------------------------------------------------
   MULTER CONFIG
---------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ----------------------------------------------------
   GET ALL FACULTY DETAILS SEO PAGES
   GET /api/faculty-details-seo
---------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const pages = await FacultyDetailsSEO.find().sort({
      createdAt: -1,
    });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------------------------------
   GET SINGLE FACULTY DETAILS SEO PAGE
   GET /api/faculty-details-seo/:id
---------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const page = await FacultyDetailsSEO.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------------------------------
   UPDATE FACULTY DETAILS SEO PAGE
   PUT /api/faculty-details-seo/:id
---------------------------------------------------- */
router.put(
  "/:id",
  upload.single("banner_image"),
  async (req, res) => {
    try {
      const updateData = {
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        meta_keywords: req.body.meta_keywords,
        meta_canonical: req.body.meta_canonical,
        banner_text: req.body.banner_text,
      };

      if (req.file) {
        updateData.banner_image = `/uploads/faculty-details/${req.file.filename}`;
      }

      const updatedPage =
        await FacultyDetailsSEO.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );

      if (!updatedPage) {
        return res.status(404).json({ message: "Page not found" });
      }

      res.json({
        message: "Faculty details SEO updated successfully",
        data: updatedPage,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
