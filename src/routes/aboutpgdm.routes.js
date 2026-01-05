import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import AboutPgdmSEO from "../models/AboutPgdm.js";

const router = express.Router();

/* ---------------------------------------------------
   BANNER UPLOAD DIRECTORY
--------------------------------------------------- */
const uploadDir = path.join(process.cwd(), "src", "uploads", "banner");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ---------------------------------------------------
   MULTER CONFIG
--------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

/* ---------------------------------------------------
   GET ABOUT PGDM (SINGLE RECORD)
--------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const data = await AboutPgdmSEO.findOne({
      page_slug: "about-pgdm",
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ---------------------------------------------------
   GET BY SLUG (FRONTEND USE)
--------------------------------------------------- */
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const data = await AboutPgdmSEO.findOne({
      page_slug: slug,
    }).lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "About PGDM data not found",
      });
    }

    res.json(data); // ⬅️ return direct object
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ---------------------------------------------------
   UPDATE ABOUT PGDM (SEO + CONTENT)
--------------------------------------------------- */
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

        introduction: req.body.introduction,
        program_uniqueness: req.body.program_uniqueness,
        specializations: req.body.specializations,
        program_structure: req.body.program_structure,
        academic_calendar: req.body.academic_calendar,
        placement: req.body.placement,
      };

      /* ---------- Banner Image ---------- */
      if (req.file) {
        updateData.banner_image = `uploads/banner/${req.file.filename}`;
      }

      const updated = await AboutPgdmSEO.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "About PGDM record not found",
        });
      }

      res.json({
        success: true,
        message: "About PGDM updated successfully",
        data: updated,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

export default router;
