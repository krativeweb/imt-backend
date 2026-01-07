import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import FellowprograminManagement from "../models/FellowprograminManagement.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   UPLOAD DIRECTORY
   src/uploads/fellowprogram-in-management/banner
--------------------------------------------------- */
const uploadBaseDir = path.join(
  __dirname,
  "../uploads/fellowprogram-in-management"
);
const bannerDir = path.join(uploadBaseDir, "banner");

if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

/* ---------------------------------------------------
   SERVE UPLOADS
   URL:
   /api/fellowprogram-in-management/uploads/fellowprogram-in-management/banner/file.png
--------------------------------------------------- */
router.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* ---------------------------------------------------
   MULTER CONFIG
--------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, bannerDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    );
  },
});

const upload = multer({ storage });

/* ---------------------------------------------------
   GET (ADMIN TABLE – ARRAY)
--------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const data = await FellowprograminManagement.find({
      page_slug: "fellowprogram-in-management",
    }).lean();

    res.json(data || []);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ---------------------------------------------------
   GET BY SLUG (FRONTEND – OBJECT)
--------------------------------------------------- */
router.get("/slug/:slug", async (req, res) => {
  try {
    const data = await FellowprograminManagement.findOne({
      page_slug: req.params.slug,
    }).lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Fellow Program data not found",
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ---------------------------------------------------
   UPDATE (SEO + BANNER + OVERVIEW)
--------------------------------------------------- */
router.put(
  "/:id",
  upload.single("banner_image"),
  async (req, res) => {
    try {
      const updateData = {
        /* -------- SEO -------- */
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        meta_keywords: req.body.meta_keywords,
        meta_canonical: req.body.meta_canonical,

        /* -------- BANNER -------- */
        banner_text: req.body.banner_text,

        /* -------- CONTENT -------- */
        pgdm_overview: req.body.pgdm_overview,
      };

      if (req.file) {
        updateData.banner_image =
          `/api/fellowprogram-in-management/uploads/fellowprogram-in-management/banner/${req.file.filename}`;
      }

      const updated =
        await FellowprograminManagement.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Fellow Program record not found",
        });
      }

      res.json({
        success: true,
        message: "Fellow Program updated successfully",
        data: updated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export default router;
