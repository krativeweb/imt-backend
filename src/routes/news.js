import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import News from "../models/News.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------
   MULTER UPLOAD SETUP (Correct path)
   Save to: src/uploads/news
--------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Go UP one folder because routes/ is inside src/
    const uploadPath = path.join(__dirname, "..", "uploads", "news");

    // Auto-create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const uploadNews = multer({ storage });

/* ---------------------------------------------
   ADD NEWS
--------------------------------------------- */
router.post("/add", uploadNews.single("images"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "Image is required" });

    const created = await News.create({
      image: `uploads/news/${req.file.filename}`,

      content: req.body.content,
    });

    res.json({ msg: "News created successfully", data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

/* ---------------------------------------------
   GET ALL NEWS (active only)
--------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const news = await News.find({ isDel: false }).sort({ createdAt: -1 });
    res.json({ data: news });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

/* ---------------------------------------------
   GET SINGLE NEWS
--------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const item = await News.findOne({
      _id: req.params.id,
      isDel: false,
    });

    res.json({ data: item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

/* ---------------------------------------------
   EDIT NEWS
--------------------------------------------- */
/* ---------------------------------------------
   EDIT NEWS
--------------------------------------------- */
router.put("/edit/:id", uploadNews.single("images"), async (req, res) => {
  try {
    const updateData = { content: req.body.content };

    if (req.file) {
      updateData.image = `uploads/news/${req.file.filename}`;  // <-- FIXED
    }

    const updated = await News.findOneAndUpdate(
      { _id: req.params.id, isDel: false },
      updateData,
      { new: true }
    );

    res.json({ msg: "News updated successfully", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});


/* ---------------------------------------------
   SOFT DELETE NEWS
--------------------------------------------- */
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await News.findByIdAndUpdate(
      req.params.id,
      { isDel: true },
      { new: true }
    );

    res.json({ msg: "News soft-deleted", data: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

export default router;
