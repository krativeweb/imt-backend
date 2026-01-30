import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Happenings from "../models/Happenings.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(process.cwd(), "src", "uploads", "happenings");

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
    const name = `happenings-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ===============================
   GET ALL (SORT BY DATE DESC)
================================ */
router.get("/", async (req, res) => {
  try {
    const happenings = await Happenings.find({ isDeleted: false })
      .sort({ sortDate: -1 }); // ✅ DESCENDING DATE

    res.json({ success: true, data: happenings });
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
    const happening = await Happenings.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!happening) {
      return res.status(404).json({
        success: false,
        message: "Happening not found",
      });
    }

    res.json({ success: true, data: happening });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD HAPPENING
================================ */
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const { title, description, sortDate } = req.body;

    if (!title || !description || !sortDate) {
      return res.status(400).json({
        success: false,
        message: "Title, description and date are required",
      });
    }

    if (!req.files || !req.files.length) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const images = req.files.map(
      (file) => `uploads/happenings/${file.filename}`
    );

    const happening = await Happenings.create({
      title,
      description,
      sortDate: new Date(sortDate), // ✅ calendar date
      images,
    });

    res.status(201).json({
      success: true,
      data: happening,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE HAPPENING
================================ */
router.put("/:id", upload.array("images", 10), async (req, res) => {
  try {
    const happening = await Happenings.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!happening) {
      return res.status(404).json({
        success: false,
        message: "Happening not found",
      });
    }

    const { title, description, sortDate } = req.body;

    if (title) happening.title = title;
    if (description) happening.description = description;
    if (sortDate) happening.sortDate = new Date(sortDate); // ✅

    /* ===============================
       REMOVE IMAGES
    ================================ */
    if (req.body.remove_images) {
      const removeList = Array.isArray(req.body.remove_images)
        ? req.body.remove_images
        : [req.body.remove_images];

      happening.images = happening.images.filter(
        (img) => !removeList.includes(img)
      );

      removeList.forEach((imgPath) => {
        const fullPath = path.join(process.cwd(), "src", imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    /* ===============================
       ADD NEW IMAGES
    ================================ */
    if (req.files && req.files.length) {
      const newImages = req.files.map(
        (file) => `uploads/happenings/${file.filename}`
      );
      happening.images.push(...newImages);
    }

    await happening.save();

    res.json({
      success: true,
      data: happening,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   SOFT DELETE
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const happening = await Happenings.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!happening) {
      return res.status(404).json({
        success: false,
        message: "Happening not found",
      });
    }

    happening.isDeleted = true;
    happening.deletedAt = new Date();
    await happening.save();

    res.json({
      success: true,
      message: "Happening deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
