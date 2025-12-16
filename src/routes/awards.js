import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Award from "../models/Award.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(process.cwd(), "src", "uploads", "awards");

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
    const name = `award-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

/* ===============================
   GET ALL (NON-DELETED)
================================ */
router.get("/", async (req, res) => {
  try {
    const awards = await Award.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: awards });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   ADD AWARD
================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, type, content } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const award = await Award.create({
      title,
      type,
      content,
      image: `uploads/awards/${req.file.filename}`,
    });

    res.status(201).json({ success: true, data: award });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   UPDATE AWARD
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, type, content } = req.body;

    const award = await Award.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!award)
      return res.status(404).json({ message: "Award not found" });

    if (req.file) {
      award.image = `uploads/awards/${req.file.filename}`;
    }

    award.title = title;
    award.type = type;
    award.content = content;

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
    const award = await Award.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!award)
      return res.status(404).json({ message: "Award not found" });

    award.isDeleted = true;
    award.deletedAt = new Date();
    await award.save();

    res.json({ success: true, message: "Award soft deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



export default router;
