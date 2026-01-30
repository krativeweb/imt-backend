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
   PATH HELPERS
=================================================== */
const normalizePath = (p) => {
  if (!p) return null;

  let val = decodeURIComponent(p).trim();
  val = val.replace(/^https?:\/\/[^/]+/i, "");

  const apiIndex = val.indexOf("/api/");
  if (apiIndex !== -1) {
    val = val.substring(apiIndex);
  }

  return val;
};

const getFileName = (p) => {
  if (!p) return null;
  const clean = normalizePath(p);
  return clean ? path.basename(clean) : null;
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
    res.status(500).json({ success: false, message: "Fetch failed" });
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

      const oldDoc = await Studentlife.findById(req.params.id);
      if (!oldDoc) {
        return res
          .status(404)
          .json({ success: false, message: "Record not found" });
      }

      /* =========================
         TEXT DATA
      ========================= */
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

      /* =========================
         BANNER IMAGE
      ========================= */
      if (files?.banner_image?.length) {
        updateData.banner_image = `/api/student-life/uploads/student-life/banner/${files.banner_image[0].filename}`;
      }

      /* =========================
         LIFE IMAGES (FIXED)
      ========================= */
      let raw =
        body.existing_student_life_images ??
        body["existing_student_life_images[]"];

      let keepImages = [];

      if (raw === "__EMPTY__") {
        keepImages = [];
      } else if (!raw) {
        keepImages = oldDoc.student_life_images || [];
      } else {
        keepImages = Array.isArray(raw) ? raw : [raw];
      }

      const keepFiles = keepImages
        .map(getFileName)
        .filter(Boolean);

      const dbFiles = (oldDoc.student_life_images || [])
        .map(getFileName)
        .filter(Boolean);

      const removedFiles = dbFiles.filter(
        (f) => !keepFiles.includes(f)
      );

      /* DELETE FILES FROM DISK */
      removedFiles.forEach((file) => {
        const filePath = path.join(lifeDir, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      /* NEW UPLOADS */
      const newImages =
        files?.student_life_images?.map(
          (f) =>
            `/api/student-life/uploads/student-life/life/${f.filename}`
        ) || [];

      /* FINAL IMAGE ARRAY */
      updateData.student_life_images = [
        ...(oldDoc.student_life_images || []).filter((img) =>
          keepFiles.includes(getFileName(img))
        ),
        ...newImages,
      ];

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
