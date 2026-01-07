import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import CampusPlacements from "../models/campusPlacements.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   BANNER UPLOAD DIRECTORY
--------------------------------------------------- */
const uploadDir = path.join(__dirname, "../uploads/banner");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ---------------------------------------------------
   SERVE UPLOADS (ROUTER ONLY)
--------------------------------------------------- */
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* ---------------------------------------------------
   MULTER CONFIG
--------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

/* ---------------------------------------------------
   🔄 EDIT CAMPUS PLACEMENTS (ONLY)
   PUT /api/campus-placements/:id
--------------------------------------------------- */
router.put("/:id", upload.single("banner_image"), async (req, res) => {
  try {
    const updateData = {
      page_title: req.body.page_title,
      page_slug: req.body.page_slug,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
      meta_canonical: req.body.meta_canonical,

      banner_text: req.body.banner_text,

      head_cro_message: req.body.head_cro_message,
      final_placements: req.body.final_placements,
      placements_procedure: req.body.placements_procedure,
      placements_brochure: req.body.placements_brochure,
      student_committees: req.body.student_committees,
      contact_us: req.body.contact_us,
    };

    if (req.file) {
      updateData.banner_image = `/uploads/banner/${req.file.filename}`;
    }

    const updated = await CampusPlacements.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      message: "Campus Placements updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await CampusPlacements.findOne();

    if (!data) {
      return res.status(404).json({ message: "No record found" });
    }

    res.json(data); // ✅ direct document
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
