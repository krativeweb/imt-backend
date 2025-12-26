import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import InternationalAssociation from "../models/InternationalAssociation.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "international-association"
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
    const name = `international-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

/* ===============================
   GET ALL (NON-DELETED)
================================ */
router.get("/", async (req, res) => {
  try {
    const records = await InternationalAssociation.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: records });
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
    const record = await InternationalAssociation.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "International Association not found",
      });
    }

    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD INTERNATIONAL ASSOCIATION
================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const record = await InternationalAssociation.create({
      title,
      image: `uploads/international-association/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE INTERNATIONAL ASSOCIATION
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const record = await InternationalAssociation.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "International Association not found",
      });
    }

    if (req.body.title) {
      record.title = req.body.title;
    }

    if (req.file) {
      record.image = `uploads/international-association/${req.file.filename}`;
    }

    await record.save();

    res.json({
      success: true,
      data: record,
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
    const record = await InternationalAssociation.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "International Association not found",
      });
    }

    record.isDeleted = true;
    record.deletedAt = new Date();
    await record.save();

    res.json({
      success: true,
      message: "International Association deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
