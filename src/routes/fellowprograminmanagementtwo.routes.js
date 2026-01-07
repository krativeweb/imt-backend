import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import FellowprograminmanagementTwo from "../models/FellowprograminmanagementTwo.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
   src/uploads/fellow-program-in-management-admission/banner
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "fellow-program-in-management-admission",
  "banner"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ===============================
   MULTER CONFIG
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `fpm-admission-banner-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

/* ===============================
   GET (ADMIN TABLE)
================================ */
router.get("/", async (req, res) => {
  try {
    const data = await FellowprograminmanagementTwo.find({
      page_slug: "fellow-program-in-management-admission",
    }).lean();

    res.json(data || []);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   GET BY SLUG (FRONTEND)
================================ */
router.get("/slug/:slug", async (req, res) => {
  try {
    const data = await FellowprograminmanagementTwo.findOne({
      page_slug: req.params.slug,
    }).lean();

    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "FPM Admission data not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   UPDATE (SEO + BANNER + CONTENT)
================================ */
router.put("/:id", upload.single("banner_image"), async (req, res) => {
  try {
    const updateData = {
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
      meta_canonical: req.body.meta_canonical,

      banner_text: req.body.banner_text,

      program_overview: req.body.program_overview,
      specializations: req.body.specializations,
      admission_process: req.body.admission_process,
      financial_aid: req.body.financial_aid,
      aicte_approval: req.body.aicte_approval,
      contact_us: req.body.contact_us,
    };

    /* ✅ CLEAN IMAGE PATH (NO /api) */
    if (req.file) {
      updateData.banner_image =
        `uploads/fellow-program-in-management-admission/banner/${req.file.filename}`;
    }

    const updated =
      await FellowprograminmanagementTwo.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "FPM Admission record not found" });

    res.json({
      success: true,
      message: "FPM Admission updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
