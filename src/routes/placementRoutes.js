import express from "express";
import Placement from "../models/Placement.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/* ----------------------------------------------------
   FIX: Always use ROOT uploads/placement directory
   Path: imt-backend/src/uploads/placement
----------------------------------------------------- */

const uploadDir = path.join(process.cwd(), "src", "uploads", "placement");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created upload folder:", uploadDir);
}

/* ----------------------------------------------------
   MULTER STORAGE
----------------------------------------------------- */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

/* ----------------------------------------------------
   GET ALL PLACEMENTS
----------------------------------------------------- */

router.get("/", async (req, res) => {
  try {
    const data = await Placement.find().sort({ createdAt: -1 });
    res.json({ count: data.length, data });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/* ----------------------------------------------------
   GET BY ID
----------------------------------------------------- */

router.get("/:id", async (req, res) => {
  try {
    const data = await Placement.findById(req.params.id);

    if (!data)
      return res.status(404).json({ msg: "Placement page not found" });

    res.json({ data });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/* ----------------------------------------------------
   UPDATE PAGE  — DELETE OLD IMAGE, SAVE NEW IMAGE
   AND REPLACE ENTIRE GALLERY
----------------------------------------------------- */

router.put(
  "/edit/:id",
  upload.fields([
    { name: "banner_image", maxCount: 1 },
    { name: "director_image", maxCount: 1 },
    { name: "corporate_image", maxCount: 1 },
    { name: "sector_stat_image", maxCount: 1 },
    { name: "new_gallery_images[]", maxCount: 50 },
  ]),
  async (req, res) => {
    try {
      const placement = await Placement.findById(req.params.id);
      if (!placement) {
        return res.status(404).json({ msg: "Placement not found" });
      }

      const body = req.body;

      /* ----------------------------------------------------
         HELPERS
      ----------------------------------------------------- */
      const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

      const safeDelete = (relativePath) => {
        if (!relativePath) return;
        const fullPath = path.join(process.cwd(), "src", relativePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log("🗑 Deleted:", fullPath);
        }
      };

      /* ----------------------------------------------------
         UPDATE SINGLE IMAGES
      ----------------------------------------------------- */
      const singleImages = [
        "banner_image",
        "director_image",
        "corporate_image",
        "sector_stat_image",
      ];

      singleImages.forEach((key) => {
        if (req.files[key]) {
          if (placement[key]) safeDelete(placement[key]);
          placement[key] = `uploads/placement/${req.files[key][0].filename}`;
        }
      });

      /* ----------------------------------------------------
         GALLERY LOGIC (REMOVE + KEEP + ADD)
      ----------------------------------------------------- */

      // 1️⃣ REMOVE selected images
      const removedImages = toArray(
        body["remove_gallery_images[]"] || body.remove_gallery_images
      );

      removedImages.forEach((imgPath) => {
        safeDelete(imgPath);
        placement.gallery_images = placement.gallery_images.filter(
          (img) => img !== imgPath
        );
      });

      // 2️⃣ KEEP remaining images (sent from frontend)
      const remainingImages = toArray(
        body["gallery_images[]"] || body.gallery_images
      );

      placement.gallery_images = remainingImages;

      // 3️⃣ ADD newly uploaded images
      if (req.files["new_gallery_images[]"]) {
        const newImgs = req.files["new_gallery_images[]"].map(
          (f) => `uploads/placement/${f.filename}`
        );
        placement.gallery_images.push(...newImgs);
      }

      /* ----------------------------------------------------
         UPDATE TEXT FIELDS
      ----------------------------------------------------- */
      const textFields = [
        "page_title",
        "page_slug",
        "meta_title",
        "meta_description",
        "meta_keywords",
        "meta_canonical",
        "banner_text",
        "ranking_content",
        "director_message",
        "corporate_message",
      ];

      textFields.forEach((key) => {
        if (body[key] !== undefined) {
          placement[key] = body[key];
        }
      });

      /* ----------------------------------------------------
         SAVE
      ----------------------------------------------------- */
      await placement.save();

      res.json({
        msg: "Updated successfully",
        data: placement,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        msg: "Server error",
        error: err.message,
      });
    }
  })

export default router;
