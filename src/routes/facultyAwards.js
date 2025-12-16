import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import FacultyAward from "../models/FacultyAward.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "faculty-awards"
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
    const name = `faculty-award-${Date.now()}-${Math.round(
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
    const awards = await FacultyAward.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: awards });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   ADD FACULTY AWARD
================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { content } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    if (!content)
      return res.status(400).json({ message: "Content is required" });

    const award = await FacultyAward.create({
      image: `uploads/faculty-awards/${req.file.filename}`,
      content,
    });

    res.status(201).json({ success: true, data: award });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   UPDATE FACULTY AWARD
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const award = await FacultyAward.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!award)
      return res.status(404).json({ message: "Faculty Award not found" });

    if (req.body.content) {
      award.content = req.body.content;
    }

    // Replace image if new one uploaded
    if (req.file) {
      award.image = `uploads/faculty-awards/${req.file.filename}`;
    }

    await award.save();

    res.json({ success: true, data: award });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   SOFT DELETE
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const award = await FacultyAward.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!award)
      return res.status(404).json({ message: "Faculty Award not found" });

    award.isDeleted = true;
    award.deletedAt = new Date();
    await award.save();

    res.json({
      success: true,
      message: "Faculty Award soft deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


export default router;
