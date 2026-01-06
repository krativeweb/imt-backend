import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import PgdmLogistics from "../models/PgdmLscm.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   PGDM LOGISTICS BANNER UPLOAD DIRECTORY
   src/uploads/pgdm-logistics-supply-chain/banner
--------------------------------------------------- */
const uploadBaseDir = path.join(
  __dirname,
  "../uploads/pgdm-logistics-supply-chain"
);
const bannerDir = path.join(uploadBaseDir, "banner");

// Ensure folders exist
if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

/* ---------------------------------------------------
   SERVE UPLOADS
   URL:
   /api/pgdm-logistics-supply-chain/uploads/pgdm-logistics-supply-chain/banner/filename.png
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
   GET PGDM LOGISTICS (ADMIN – ARRAY)
--------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const data = await PgdmLogistics.find({
      page_slug: "pgdm-logistics-supply-chain",
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
   GET PGDM LOGISTICS BY SLUG (FRONTEND – OBJECT)
--------------------------------------------------- */
router.get("/slug/:slug", async (req, res) => {
  try {
    const data = await PgdmLogistics.findOne({
      page_slug: req.params.slug,
    }).lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "PGDM Logistics data not found",
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
   UPDATE PGDM LOGISTICS
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

        /* -------- PGDM LOGISTICS CONTENT -------- */
        pgdm_logistics_supply_chain:
          req.body.pgdm_logistics_supply_chain,
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
          `/api/pgdm-logistics-supply-chain/uploads/pgdm-logistics-supply-chain/banner/${req.file.filename}`;
      }

      const updated = await PgdmLogistics.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "PGDM Logistics record not found",
        });
      }

      res.json({
        success: true,
        message:
          "PGDM Logistics & Supply Chain updated successfully",
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
