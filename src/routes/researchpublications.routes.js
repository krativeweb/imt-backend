import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ResearchPublicationSEO from "../models/ResearchPublications.js";

const router = express.Router();

/* ----------------------------------------------------
   UPLOAD DIRECTORY
---------------------------------------------------- */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "research-publication"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created upload folder:", uploadDir);
}

/* ----------------------------------------------------
   MULTER CONFIG
---------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ----------------------------------------------------
   GET ALL (ONLY ONE EXPECTED)
---------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const pages = await ResearchPublicationSEO.find().sort({
      createdAt: -1,
    });

    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------------------------------
   GET SINGLE BY ID
---------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const page = await ResearchPublicationSEO.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        message: "Research publication page not found",
      });
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------------------------------
   UPDATE PAGE (SCHEMA SAFE)
---------------------------------------------------- */
router.put(
  "/:id",
  upload.single("banner_image"),
  async (req, res) => {
    try {
      const updateData = {
        meta_title: req.body.meta_title || "",
        meta_description: req.body.meta_description || "",
        meta_keywords: req.body.meta_keywords || "",
        meta_canonical: req.body.meta_canonical || "",

        banner_text: req.body.banner_text || "",

        research_publications: req.body.research_publications || "",
        journal_publications: req.body.journal_publications || "",
        cases: req.body.cases || "",
      };

      if (req.file) {
        updateData.banner_image =
          `/uploads/research-publication/${req.file.filename}`;
      }

      const updatedPage =
        await ResearchPublicationSEO.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );

      if (!updatedPage) {
        return res.status(404).json({
          message: "Research publication page not found",
        });
      }

      res.json({
        success: true,
        message: "Research Publication SEO updated successfully",
        data: updatedPage,
      });
    } catch (err) {
      console.error("Update Error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
