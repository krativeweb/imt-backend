import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import DistinguishedClient from "../models/DistinguishedClients.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "distinguished-clients"
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
    const name = `client-${Date.now()}-${Math.round(
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
    const records = await DistinguishedClient.find({
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
    const record = await DistinguishedClient.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Distinguished Client not found",
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
   ADD DISTINGUISHED CLIENT
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

    const record = await DistinguishedClient.create({
      title,
      image: `uploads/distinguished-clients/${req.file.filename}`,
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
   UPDATE DISTINGUISHED CLIENT
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const record = await DistinguishedClient.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Distinguished Client not found",
      });
    }

    if (req.body.title) {
      record.title = req.body.title;
    }

    if (req.file) {
      record.image = `uploads/distinguished-clients/${req.file.filename}`;
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
    const record = await DistinguishedClient.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Distinguished Client not found",
      });
    }

    record.isDeleted = true;
    record.deletedAt = new Date();
    await record.save();

    res.json({
      success: true,
      message: "Distinguished Client deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
