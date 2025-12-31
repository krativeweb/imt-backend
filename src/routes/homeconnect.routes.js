import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import HomeConnect from "../models/Homeconnect.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "home-connect"
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
    const name = `home-connect-${Date.now()}-${Math.round(
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
    const homeConnect = await HomeConnect.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: homeConnect });
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
    const homeConnect = await HomeConnect.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!homeConnect) {
      return res.status(404).json({
        success: false,
        message: "Home Connect item not found",
      });
    }

    res.json({ success: true, data: homeConnect });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD HOME CONNECT
================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const homeConnect = await HomeConnect.create({
      title,
      description,
      image: `uploads/home-connect/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      data: homeConnect,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE HOME CONNECT
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const homeConnect = await HomeConnect.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!homeConnect) {
      return res.status(404).json({
        success: false,
        message: "Home Connect item not found",
      });
    }

    if (req.body.title) {
      homeConnect.title = req.body.title;
    }

    if (req.body.description) {
      homeConnect.description = req.body.description;
    }

    if (req.file) {
      homeConnect.image = `uploads/home-connect/${req.file.filename}`;
    }

    await homeConnect.save();

    res.json({
      success: true,
      data: homeConnect,
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
    const homeConnect = await HomeConnect.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!homeConnect) {
      return res.status(404).json({
        success: false,
        message: "Home Connect item not found",
      });
    }

    homeConnect.isDeleted = true;
    homeConnect.deletedAt = new Date();
    await homeConnect.save();

    res.json({
      success: true,
      message: "Home Connect item soft deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
