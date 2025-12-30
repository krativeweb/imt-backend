import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ResearchInFocus from "../models/ResearchInFocus.js";

const router = express.Router();

/* ===============================
   SLUG GENERATOR (NO DEPENDENCY)
================================ */
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "research-in-focus"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ===============================
   MULTER CONFIG
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(
      null,
      `research-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    );
  },
});

const upload = multer({ storage });

/* ===============================
   GET ALL (NON-DELETED)
================================ */
router.get("/", async (req, res) => {
  try {
    const data = await ResearchInFocus.find({ isDeleted: false })
      .sort({ createdAt: -1 });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   GET BY SLUG (PUBLIC)
================================ */
router.get("/slug/:slug", async (req, res) => {
  try {
    const item = await ResearchInFocus.findOne({
      page_slug: req.params.slug,
      isDeleted: false,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


/* ===============================
   GET SINGLE
================================ */
router.get("/:id", async (req, res) => {
  try {
    const item = await ResearchInFocus.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   ADD RESEARCH
================================ */
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "details_banner_image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        home_title,
        details_page_title,
        sub_title,
        short_description,
        main_description,

        page_title,           // ✅ correct source
        meta_title,
        meta_keywords,
        meta_description,
        meta_canonical,
        banner_text,
      } = req.body;

      if (!name || !home_title || !page_title) {
        return res.status(400).json({
          success: false,
          message: "Name, Home Title and Page Title are required",
        });
      }

      // ✅ SLUG GENERATED ONLY FROM page_title
      const page_slug = generateSlug(page_title);

      const newDoc = await ResearchInFocus.create({
        name,
        home_title,
        details_page_title,
        sub_title,
        short_description,
        main_description,

        page_title,
        page_slug,

        meta_title,
        meta_keywords,
        meta_description,
        meta_canonical,
        banner_text,

        image: req.files?.image
          ? `uploads/research-in-focus/${req.files.image[0].filename}`
          : null,

        details_banner_image: req.files?.details_banner_image
          ? `uploads/research-in-focus/${req.files.details_banner_image[0].filename}`
          : null,
      });

      res.status(201).json({ success: true, data: newDoc });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/* ===============================
   UPDATE RESEARCH
================================ */
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "details_banner_image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const doc = await ResearchInFocus.findOne({
        _id: req.params.id,
        isDeleted: false,
      });

      if (!doc) {
        return res.status(404).json({
          success: false,
          message: "Research not found",
        });
      }

      // Update text fields
      Object.assign(doc, req.body);

      // ✅ Regenerate slug ONLY if page_title changes
      if (req.body.page_title) {
        doc.page_slug = generateSlug(req.body.page_title);
      }

      // Update images
      if (req.files?.image) {
        doc.image = `uploads/research-in-focus/${req.files.image[0].filename}`;
      }

      if (req.files?.details_banner_image) {
        doc.details_banner_image =
          `uploads/research-in-focus/${req.files.details_banner_image[0].filename}`;
      }

      await doc.save();

      res.json({ success: true, data: doc });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/* ===============================
   SOFT DELETE
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const doc = await ResearchInFocus.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    doc.isDeleted = true;
    doc.deletedAt = new Date();
    await doc.save();

    res.json({
      success: true,
      message: "Research deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
