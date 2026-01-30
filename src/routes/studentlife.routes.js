import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Studentlife from "../models/Studentlife.js";

const router = express.Router();

/* ===================================================
   FIX __DIRNAME (ESM)
=================================================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===================================================
   UPLOAD DIRECTORIES
=================================================== */
const uploadRoot = path.join(__dirname, "../uploads");
const studentLifeDir = path.join(uploadRoot, "student-life");
const bannerDir = path.join(studentLifeDir, "banner");
const lifeDir = path.join(studentLifeDir, "life");

/* Ensure folders exist */
[bannerDir, lifeDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/* ===================================================
   STATIC FILES
=================================================== */
router.use("/uploads", express.static(uploadRoot));

/* ===================================================
   MULTER CONFIG
=================================================== */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === "banner_image") {
      cb(null, bannerDir);
    } else if (file.fieldname === "student_life_images") {
      cb(null, lifeDir);
    } else {
      cb(null, studentLifeDir);
    }
  },

  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

/* ===================================================
   PATH NORMALIZER (🔥 KEY FIX)
=================================================== */
const normalizePath = (p) => {
  if (!p) return null;

  let val = decodeURIComponent(p).trim();

  // Remove domain if present
  val = val.replace(/^https?:\/\/[^/]+/i, "");

  // Keep only API upload path
  const idx = val.indexOf("/api/student-life/uploads/");
  if (idx !== -1) {
    val = val.substring(idx);
  }

  return val;
};

/* ===================================================
   GET ALL
=================================================== */
router.get("/", async (req, res) => {
  try {
    const pages = await Studentlife.find({
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(pages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
});

/* ===================================================
   GET BY ID
=================================================== */
router.get("/:id", async (req, res) => {
  try {
    const page = await Studentlife.findById(req.params.id);

    if (!page || page.isDeleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===================================================
   UPDATE (IMAGE DELETE FIXED)
=================================================== */
router.put(
  "/:id",
  upload.fields([
    { name: "banner_image", maxCount: 1 },
    { name: "student_life_images", maxCount: 30 },
  ]),
  async (req, res) => {
    try {
      const { body, files } = req;

      /* FIND OLD DOC */
      const oldDoc = await Studentlife.findById(req.params.id);
      if (!oldDoc) {
        return res.status(404).json({ success: false, message: "Record not found" });
      }

      /* TEXT DATA */
      const updateData = {
        page_title: body.page_title,
        page_slug: body.page_slug,
        meta_title: body.meta_title,
        meta_description: body.meta_description,
        meta_keywords: body.meta_keywords,
        meta_canonical: body.meta_canonical,
        banner_text: body.banner_text,
        student_life_content: body.student_life_content,
      };

      /* BANNER IMAGE */
      if (files?.banner_image?.length) {
        updateData.banner_image =
          `/api/student-life/uploads/student-life/banner/${files.banner_image[0].filename}`;
      }

      /* ---------------- LIFE IMAGES ---------------- */

      /* GET EXISTING FROM FORM */
      let raw = body["existing_student_life_images[]"];
      let keepImages = [];

      if (raw === undefined) {
        keepImages = oldDoc.student_life_images || [];
      } else {
        keepImages = Array.isArray(raw) ? raw : [raw];
      }

      keepImages = keepImages
        .map(normalizePath)
        .filter(Boolean);

      const dbImages = (oldDoc.student_life_images || [])
        .map(normalizePath)
        .filter(Boolean);

      /* FIND REMOVED */
      const removedImages = dbImages.filter(
        (img) => !keepImages.includes(img)
      );

      /* DELETE REMOVED FILES */
      removedImages.forEach((img) => {
        const relativePath = img.replace(
          "/api/student-life/uploads/",
          ""
        );

        const filePath = path.join(uploadRoot, relativePath);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("Deleted image:", filePath);
        }
      });

      /* NEW UPLOADS */
      const newImages =
        files?.student_life_images?.map(
          (f) =>
            `/api/student-life/uploads/student-life/life/${f.filename}`
        ) || [];

      /* FINAL MERGE */
      updateData.student_life_images = [
        ...keepImages,
        ...newImages,
      ];

      /* UPDATE DB */
      const updated = await Studentlife.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json({
        success: true,
        message: "Updated successfully",
        data: updated,
      });

    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

export default router;
