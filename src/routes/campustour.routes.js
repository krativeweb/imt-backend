import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import CampusTour from "../models/Campustour.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   UPLOAD DIRECTORY (CAMPUS TOUR)
   uploads/campus-tour/banner
--------------------------------------------------- */
const uploadBaseDir = path.join(__dirname, "../uploads/campus-tour");
const bannerDir = path.join(uploadBaseDir, "banner");

// Ensure folders exist
if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

/* ---------------------------------------------------
   STATIC FILE SERVING
   URL:
   /api/campus-tour/uploads/campus-tour/banner/filename.jpg
--------------------------------------------------- */
router.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* ---------------------------------------------------
   MULTER CONFIG (ONLY BANNER IMAGE)
--------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, bannerDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

/* ---------------------------------------------------
   GET ALL CAMPUS TOUR (ADMIN – ARRAY)
--------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const data = await CampusTour.find({
      isDeleted: false,
    }).lean();

    res.json(data || []);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/* ---------------------------------------------------
   GET CAMPUS TOUR BY SLUG (FRONTEND – OBJECT)
--------------------------------------------------- */
router.get("/slug/:slug", async (req, res) => {
  try {
    const data = await CampusTour.findOne({
      page_slug: req.params.slug,
      isDeleted: false,
    }).lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Campus Tour data not found",
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/* ---------------------------------------------------
   UPDATE CAMPUS TOUR (SEO + BANNER + VIDEO)
--------------------------------------------------- */
router.put(
  "/:id",
  upload.single("banner_image"),
  async (req, res) => {
    try {
      const body = req.body;

      /* ---------------- UPDATE DATA ---------------- */
      const updateData = {
        page_title: body.page_title,
        page_slug: body.page_slug,

        meta_title: body.meta_title,
        meta_description: body.meta_description,
        meta_keywords: body.meta_keywords,
        meta_canonical: body.meta_canonical,

        banner_text: body.banner_text,

        video_title: body.video_title,
        video_url: body.video_url,
      };

      /* ---------------- BANNER IMAGE ---------------- */
      if (req.file) {
        updateData.banner_image =
          `/api/campus-tour/uploads/campus-tour/banner/${req.file.filename}`;
      }

      const updated = await CampusTour.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Campus Tour record not found",
        });
      }

      res.json({
        success: true,
        message: "Campus Tour updated successfully",
        data: updated,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

export default router;
