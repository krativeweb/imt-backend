import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Media from "../models/Media.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   MEDIA BANNER UPLOAD DIRECTORY
   src/uploads/media/banner
--------------------------------------------------- */
const uploadBaseDir = path.join(__dirname, "../uploads/media");
const bannerDir = path.join(uploadBaseDir, "banner");

/* Ensure folders exist */
if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

/* ---------------------------------------------------
   STATIC FILE SERVING (ROUTER SCOPE)
   URL:
   /api/media/uploads/media/banner/filename.png
--------------------------------------------------- */
router.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* ---------------------------------------------------
   MULTER CONFIG (MEDIA)
--------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, bannerDir);
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
   GET MEDIA (ADMIN – ARRAY)
--------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const data = await Media.find({
      isDeleted: false,
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
   GET MEDIA BY SLUG (FRONTEND – OBJECT)
--------------------------------------------------- */
router.get("/slug/:slug", async (req, res) => {
  try {
    const data = await Media.findOne({
      page_slug: req.params.slug,
      isDeleted: false,
    }).lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Media content not found",
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
   UPDATE MEDIA (SEO + BANNER + MEDIA ROOM)
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

        /* -------- MEDIA ROOM CONTENT -------- */
        media_room_2024: req.body.media_room_2024,
        media_room_2022: req.body.media_room_2022,
        media_room_2019: req.body.media_room_2019,
        media_room_2018: req.body.media_room_2018,
        media_room_2016: req.body.media_room_2016,
        media_room_2015: req.body.media_room_2015,
      };

      /* ---------- Banner Image ---------- */
      if (req.file) {
        updateData.banner_image =
          `/api/media/uploads/media/banner/${req.file.filename}`;
      }

      const updated = await Media.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Media record not found",
        });
      }

      res.json({
        success: true,
        message: "Media content updated successfully",
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
