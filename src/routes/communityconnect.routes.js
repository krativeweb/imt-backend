import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import CommunityConnect from "../models/Communityconnect.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   COMMUNITY CONNECT BANNER UPLOAD DIRECTORY
   src/uploads/community-connect/banner
--------------------------------------------------- */
const uploadBaseDir = path.join(
  __dirname,
  "../uploads/community-connect"
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
   GET ALL COMMUNITY CONNECT PAGES (ADMIN)
=================================================== */
router.get("/", async (req, res) => {
  try {
    const pages = await CommunityConnect.find({
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
   GET COMMUNITY CONNECT BY SLUG (FRONTEND)
=================================================== */
router.get("/slug/:slug", async (req, res) => {
  try {
    const page = await CommunityConnect.findOne({
      page_slug: req.params.slug,
      isDeleted: false,
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Community Connect page not found",
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
   UPDATE COMMUNITY CONNECT (SEO + CONTENT + IMAGE)
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

        /* ---------- CONTENT ---------- */
        banner_text: req.body.banner_text,
        community_connect: req.body.community_connect,
      };

      /* ---------- BANNER IMAGE ---------- */
      if (req.file) {
        updateData.banner_image =
          `/api/community-connect/uploads/community-connect/banner/${req.file.filename}`;
      }

      const updatedPage =
        await CommunityConnect.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );

      if (!updatedPage) {
        return res.status(404).json({
          success: false,
          message: "Community Connect page not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Community Connect updated successfully",
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
