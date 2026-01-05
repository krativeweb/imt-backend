import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import PgdmFinance from "../models/PgdmFinance.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   PGDM FINANCE BANNER UPLOAD DIRECTORY
   src/uploads/pgdm-finance/banner
--------------------------------------------------- */
const uploadBaseDir = path.join(__dirname, "../uploads/pgdm-finance");
const bannerDir = path.join(uploadBaseDir, "banner");

// Ensure folders exist
if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

/* ---------------------------------------------------
   🔥 SERVE UPLOADS FROM THIS ROUTER ONLY
   URL:
   /api/pgdm-finance/uploads/pgdm-finance/banner/filename.png
--------------------------------------------------- */
router.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* ---------------------------------------------------
   MULTER CONFIG (PGDM FINANCE)
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
   GET PGDM FINANCE (ADMIN TABLE – ARRAY)
--------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const data = await PgdmFinance.find({
      page_slug: "pgdm-finance",
    }).lean();

    // ✅ Always return array for admin table
    res.json(data || []);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ---------------------------------------------------
   GET PGDM FINANCE BY SLUG (FRONTEND – OBJECT)
--------------------------------------------------- */
router.get("/slug/:slug", async (req, res) => {
  try {
    const data = await PgdmFinance.findOne({
      page_slug: req.params.slug,
    }).lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "PGDM Finance data not found",
      });
    }

    // ✅ Return single object for frontend
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ---------------------------------------------------
   UPDATE PGDM FINANCE (SEO + CONTENT + IMAGE)
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

        /* -------- PGDM FINANCE CONTENT -------- */
        pgdm_finance: req.body.pgdm_finance,
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
          `/api/pgdm-finance/uploads/pgdm-finance/banner/${req.file.filename}`;
      }

      const updated = await PgdmFinance.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "PGDM Finance record not found",
        });
      }

      res.json({
        success: true,
        message: "PGDM Finance updated successfully",
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
