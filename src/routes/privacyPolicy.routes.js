import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import PrivacyPolicy from "../models/Privacypolicy.js";

const router = express.Router();

/* ===============================
   MULTER (BANNER IMAGE ONLY)
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("src", "uploads", "banner");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ===============================
   GET ALL PRIVACY POLICIES
================================ */
router.get("/", async (req, res) => {
  try {
    const pages = await PrivacyPolicy.find()
      .sort({ createdAt: -1 });

    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch privacy policies",
      error: error.message,
    });
  }
});

/* ===============================
   UPDATE PRIVACY POLICY BY ID
================================ */
router.put(
  "/:id",
  upload.single("banner_image"),
  async (req, res) => {
    try {
      const {
        page_title,
        page_slug,
        meta_title,
        meta_description,
        meta_keywords,
        meta_canonical,
        banner_text,
        email,
        phone,
        content,
      } = req.body;

      // Build update object
      const updateData = {
        page_title,
        page_slug,
        meta_title,
        meta_description,
        meta_keywords,
        meta_canonical,
        banner_text,
        email,
        phone,
        content,
      };

      // If new banner uploaded
      if (req.file) {
        updateData.banner_image = `/uploads/banner/${req.file.filename}`;
      }

      const updatedPage =
        await PrivacyPolicy.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedPage) {
        return res.status(404).json({
          message: "Privacy policy page not found",
        });
      }

      res.status(200).json({
        message: "Privacy policy updated successfully",
        data: updatedPage,
      });
    } catch (error) {
      console.error("Update error:", error);

      res.status(500).json({
        message: "Failed to update privacy policy",
        error: error.message,
      });
    }
  }
);

export default router;
