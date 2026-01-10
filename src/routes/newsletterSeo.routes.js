import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import NewsletterSeo from "../models/NewsletterSeo.js";

const router = express.Router();

/* ---------------------------------------------------
   BANNER UPLOAD DIRECTORY
--------------------------------------------------- */
const uploadDir = path.join(process.cwd(), "src", "uploads", "banner");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ---------------------------------------------------
   MULTER CONFIG
--------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

/* ===================================================
   GET ALL SEO DATA (Newsletter Page)
=================================================== */
router.get("/", async (req, res) => {
  try {
    const data = await NewsletterSeo.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ===================================================
   UPDATE SEO BY ID
=================================================== */
router.put("/:id", upload.single("banner_image"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.banner_image = `/uploads/banner/${req.file.filename}`;
    }

    const updated = await NewsletterSeo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "SEO data not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
