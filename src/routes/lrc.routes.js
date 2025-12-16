import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import LrcPage from "../models/LrcPage.js";

const router = express.Router();

/* ----------------------------------------------------
   UPLOAD DIR
---------------------------------------------------- */

const bannerDir = path.join(process.cwd(), "src", "uploads", "banner");

if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

/* ----------------------------------------------------
   MULTER CONFIG
---------------------------------------------------- */

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, bannerDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

/* ====================================================
   GET LRC PAGE (FETCH ALL DATA FOR EDIT)
==================================================== */

router.get("/", async (req, res) => {
  try {
    const page = await LrcPage.findOne({ page_slug: "lrc" });

    if (!page)
      return res.status(404).json({ message: "LRC page not found" });

    res.json(page);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ====================================================
   CREATE (RUN ONCE)
==================================================== */

router.post("/", async (req, res) => {
  try {
    const exists = await LrcPage.findOne({ page_slug: "lrc" });
    if (exists)
      return res.status(400).json({ message: "Already exists" });

    const page = new LrcPage({
      page_title: "Learning Resource Centre",
      page_slug: "lrc",
    });

    await page.save();
    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ====================================================
   UPDATE LRC PAGE (EDIT)
==================================================== */

router.put(
  "/:id",
  upload.single("banner_image"),
  async (req, res) => {
    try {
      const page = await LrcPage.findById(req.params.id);
      if (!page)
        return res.status(404).json({ message: "Not found" });

      if (req.file) {
        page.banner_image = `uploads/banner/${req.file.filename}`;
      }

      Object.assign(page, req.body);
      await page.save();

      res.json({ message: "LRC page updated", data: page });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
