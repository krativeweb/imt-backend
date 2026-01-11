import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ContactInfo from "../models/Contactinfo.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   CONTACT INFO BANNER UPLOAD DIRECTORY
   src/uploads/contact-info/banner
--------------------------------------------------- */
const uploadBaseDir = path.join(
  __dirname,
  "../uploads/contact-info"
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

/* ===================================================
   GET ALL CONTACT INFO PAGES (ADMIN)
=================================================== */
router.get("/", async (req, res) => {
  try {
    const pages = await ContactInfo.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(pages || []);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ===================================================
   GET CONTACT INFO BY SLUG (FRONTEND)
=================================================== */
router.get("/slug/:slug", async (req, res) => {
  try {
    const page = await ContactInfo.findOne({
      page_slug: req.params.slug,
      isDeleted: false,
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Contact Info page not found",
      });
    }

    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ===================================================
   UPDATE CONTACT INFO (SEO + CONTENT + IMAGE)
=================================================== */
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

        /* ---------- BANNER ---------- */
        banner_text: req.body.banner_text,

        /* ---------- ADMISSION ---------- */
        admission_pgdm_email: req.body.admission_pgdm_email,
        admission_fpm_email: req.body.admission_fpm_email,
        admission_phone: req.body.admission_phone,
        admission_mobile: req.body.admission_mobile,

        /* ---------- CORPORATE RELATIONS GROUP ---------- */
        crg_email: req.body.crg_email,
        crg_phone: req.body.crg_phone,
        crg_mobile: req.body.crg_mobile,

        /* ---------- SOCIAL LINKS ---------- */
        instagram_url: req.body.instagram_url,
        facebook_url: req.body.facebook_url,
        linkedin_url: req.body.linkedin_url,
        youtube_url: req.body.youtube_url,

        /* ---------- MAP ---------- */
        map_address: req.body.map_address,
        map_embed_url: req.body.map_embed_url,
      };

      /* ---------- BANNER IMAGE ---------- */
      if (req.file) {
        updateData.banner_image =
          `/api/contact-info/uploads/contact-info/banner/${req.file.filename}`;
      }

      const updatedPage = await ContactInfo.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedPage) {
        return res.status(404).json({
          success: false,
          message: "Contact Info page not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Contact Info updated successfully",
        data: updatedPage,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;
