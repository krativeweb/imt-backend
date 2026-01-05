import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import PgdmGeneral from "../models/PgdmGeneral.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   PGDM GENERAL BANNER UPLOAD DIRECTORY
   src/uploads/pgdm-general/banner
--------------------------------------------------- */
const uploadBaseDir = path.join(__dirname, "../uploads/pgdm-general");
const bannerDir = path.join(uploadBaseDir, "banner");

// Ensure folders exist
if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

/* ---------------------------------------------------
   🔥 SERVE UPLOADS FROM THIS ROUTER ONLY
   URL:
   /api/pgdm-general/uploads/pgdm-general/banner/filename.png
--------------------------------------------------- */
router.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* ---------------------------------------------------
   MULTER CONFIG (PGDM GENERAL)
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
   GET PGDM GENERAL (ADMIN TABLE – ARRAY)
--------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const data = await PgdmGeneral.find({
      page_slug: "pgdm-general",
    }).lean();

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ---------------------------------------------------
   GET PGDM GENERAL BY SLUG (FRONTEND – OBJECT)
--------------------------------------------------- */
router.get("/slug/:slug", async (req, res) => {
  try {
    const data = await PgdmGeneral.findOne({
      page_slug: req.params.slug,
    }).lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "PGDM General data not found",
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ---------------------------------------------------
   UPDATE PGDM GENERAL (SEO + CONTENT + IMAGE)
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

        curriculum: req.body.curriculum,
        key_features: req.body.key_features,
        program_outcome: req.body.program_outcome,
        pedagogy: req.body.pedagogy,
        career_opportunities: req.body.career_opportunities,
        competency_goal: req.body.competency_goal,
      };

      /* ---------- Banner Image ---------- */
      if (req.file) {
        updateData.banner_image =
          `/api/pgdm-general/uploads/pgdm-general/banner/${req.file.filename}`;
      }

      const updated = await PgdmGeneral.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "PGDM General record not found",
        });
      }

      res.json({
        success: true,
        message: "PGDM General updated successfully",
        data: updated,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

export default router;
