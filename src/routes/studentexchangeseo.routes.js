import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import StudentExchangeSeo from "../models/Studentexchangeseo.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   STUDENT EXCHANGE SEO BANNER DIRECTORY
   src/uploads/student-exchange/banner
--------------------------------------------------- */
const uploadBaseDir = path.join(
  __dirname,
  "../uploads/student-exchange"
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
   CREATE STUDENT EXCHANGE SEO
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
      };

      if (req.file) {
        data.banner_image =
          `/api/student-exchange-seo/uploads/student-exchange/banner/${req.file.filename}`;
      }

      const created = await StudentExchangeSeo.create(data);

      res.status(201).json({
        success: true,
        message: "Student Exchange SEO created successfully",
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
   READ ALL STUDENT EXCHANGE SEO
================================ */
router.get("/", async (req, res) => {
  try {
    const data = await StudentExchangeSeo.find().sort({
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
   /api/student-exchange-seo/slug/exchange-program
================================ */
router.get("/slug/:slug", async (req, res) => {
  try {
    const data = await StudentExchangeSeo.findOne({
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
    const data = await StudentExchangeSeo.findById(req.params.id);

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
   UPDATE STUDENT EXCHANGE SEO
================================ */
router.put(
  "/:id",
  upload.single("banner_image"),
  async (req, res) => {
    try {
      const updateData = {
        page_title: req.body.page_title,
        page_slug: req.body.page_slug,
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        meta_keywords: req.body.meta_keywords,
        meta_canonical: req.body.meta_canonical,
        banner_text: req.body.banner_text,
      };

      if (req.file) {
        updateData.banner_image =
          `/api/student-exchange-seo/uploads/student-exchange/banner/${req.file.filename}`;
      }

      const updated =
        await StudentExchangeSeo.findByIdAndUpdate(
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
        message: "Student Exchange SEO updated successfully",
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
   DELETE STUDENT EXCHANGE SEO
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const deleted =
      await StudentExchangeSeo.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student Exchange SEO deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
