import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ResearchInFocus from "../models/ResearchInFocus.js";

const router = express.Router();

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
    const name = `research-${Date.now()}-${Math.round(
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
    const research = await ResearchInFocus.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: research });
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
    const research = await ResearchInFocus.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!research) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    res.json({ success: true, data: research });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD RESEARCH
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

    const research = await ResearchInFocus.create({
      title,
      description,
      image: `uploads/research-in-focus/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      data: research,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE RESEARCH
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const research = await ResearchInFocus.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!research) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    if (req.body.title) {
      research.title = req.body.title;
    }

    if (req.body.description) {
      research.description = req.body.description;
    }

    // Replace image if new one uploaded
    if (req.file) {
      research.image = `uploads/research-in-focus/${req.file.filename}`;
    }

    await research.save();

    res.json({
      success: true,
      data: research,
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
    const research = await ResearchInFocus.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!research) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    research.isDeleted = true;
    research.deletedAt = new Date();
    await research.save();

    res.json({
      success: true,
      message: "Research soft deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
