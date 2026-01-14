import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ClubCommunitiesSeo from "../models/Clubcommunitiesseo.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   CLUB COMMUNITIES SEO BANNER DIRECTORY
   src/uploads/club-communities/banner
--------------------------------------------------- */
const uploadBaseDir = path.join(
  __dirname,
  "../uploads/club-communities"
);
const bannerDir = path.join(uploadBaseDir, "banner");

if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

/* ---------------------------------------------------
   SERVE UPLOADS
--------------------------------------------------- */
router.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* ---------------------------------------------------
   MULTER CONFIG (BANNER ONLY)
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

/* ==============================
   CREATE CLUB COMMUNITIES SEO
================================ */
router.post(
  "/",
  upload.single("banner_image"),
  async (req, res) => {
    try {
      const data = {
        page_title: req.body.page_title,
        page_slug: req.body.page_slug,
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        meta_keywords: req.body.meta_keywords,
        meta_canonical: req.body.meta_canonical,

        banner_text: req.body.banner_text,
        student_life_imt: req.body.student_life_imt,
      };

      if (req.file) {
        data.banner_image =
          `/api/club-communities-seo/uploads/club-communities/banner/${req.file.filename}`;
      }

      const created = await ClubCommunitiesSeo.create(data);

      res.status(201).json({
        success: true,
        message: "Club Communities SEO created successfully",
        data: created,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


/* ==============================
   READ ALL SEO PAGES
================================ */
router.get("/", async (req, res) => {
  try {
    const data = await ClubCommunitiesSeo.find().sort({
      createdAt: -1,
    });

    res.status(200).json(data || []);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ==============================
   READ BY SLUG (FRONTEND)
   /api/club-communities-seo/slug/club-life
================================ */
router.get("/slug/:slug", async (req, res) => {
  try {
    const data = await ClubCommunitiesSeo.findOne({
      page_slug: req.params.slug,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "SEO page not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ==============================
   READ SINGLE BY ID
================================ */
router.get("/:id", async (req, res) => {
  try {
    const data = await ClubCommunitiesSeo.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ==============================
   UPDATE (SEO + BANNER IMAGE)
================================ */
router.put(
  "/:id",
  upload.single("banner_image"),
  async (req, res) => {
    try {
      const updateData = {
        /* ---------- SEO ---------- */
        page_title: req.body.page_title,
        page_slug: req.body.page_slug,
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        meta_keywords: req.body.meta_keywords,
        meta_canonical: req.body.meta_canonical,

        /* ---------- CONTENT ---------- */
        banner_text: req.body.banner_text,
        student_life_imt: req.body.student_life_imt,
      };

      /* ---------- BANNER IMAGE ---------- */
      if (req.file) {
        updateData.banner_image =
          `/api/club-communities-seo/uploads/club-communities/banner/${req.file.filename}`;
      }

      const updated =
        await ClubCommunitiesSeo.findByIdAndUpdate(
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

      res.status(200).json({
        success: true,
        message: "Club Communities SEO updated successfully",
        data: updated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


/* ==============================
   DELETE (HARD DELETE – SEO)
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const deleted =
      await ClubCommunitiesSeo.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SEO page deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
