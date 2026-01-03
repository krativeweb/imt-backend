import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import AwardsRecognitionSeo from "../models/AwardsRecognitionSeo.js";

const router = express.Router();

/* ---------------------------------------------------
   BANNER UPLOAD DIRECTORY
--------------------------------------------------- */
const uploadDir = path.join(process.cwd(), "src", "uploads", "banner");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ---------------------------------------------------
   MULTER CONFIG
--------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });
  

router.get("/", async (req, res) => {
  try {
    const data = await AwardsRecognitionSeo.findOne({
      page_slug: "awards-and-recognition",
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const data = await AwardsRecognitionSeo.findOne({
      page_slug: slug,
    }).lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "SEO data not found for this slug",
      });
    }

    res.json(data); // ⬅️ IMPORTANT: return direct object (not wrapped)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ---------------------------------------------------
   UPDATE SEO & BANNER
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
      };

      if (req.file) {
        updateData.banner_image = `uploads/banner/${req.file.filename}`;
      }

      const updated = await AwardsRecognitionSeo.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "SEO record not found",
        });
      }

      res.json({
        success: true,
        message: "Awards & Recognition SEO updated successfully",
        data: updated,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

export default router;
