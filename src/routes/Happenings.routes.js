import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ResearchInFocus from "../models/Happenings.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "happenings"
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
    const name = `happenings-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
});

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
        message: "Happenings not found",
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
   ADD HAPPENINGS (MULTIPLE IMAGES)
================================ */
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
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

    const research = await ResearchInFocus.create({
      title,
      description,
      images,
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
   UPDATE HAPPENINGS
   - add new images
   - remove existing images
================================ */
router.put("/:id", upload.array("images", 10), async (req, res) => {
  try {
    const research = await ResearchInFocus.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!research) {
      return res.status(404).json({
        success: false,
        message: "Happenings not found",
      });
    }

    const { title, description } = req.body;

    if (title) research.title = title;
    if (description) research.description = description;

    /* ===============================
       REMOVE IMAGES
    ================================ */
    if (req.body.remove_images) {
      const removeList = Array.isArray(req.body.remove_images)
        ? req.body.remove_images
        : [req.body.remove_images];

      research.images = research.images.filter(
        (img) => !removeList.includes(img)
      );

      // delete files from disk
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
      research.images.push(...newImages);
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
        message: "Happenings not found",
      });
    }

    research.isDeleted = true;
    research.deletedAt = new Date();
    await research.save();

    res.json({
      success: true,
      message: "Happenings soft deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
