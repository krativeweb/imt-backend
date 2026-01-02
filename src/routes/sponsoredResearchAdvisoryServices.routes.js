import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import SponsoredResearchSEO from "../models/SponsoredResearchAdvisoryServices.js";

const router = express.Router();

/* ----------------------------------------------------
   UPLOAD DIRECTORY
   Path: src/uploads/sponsored-research
---------------------------------------------------- */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "sponsored-research"
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
   GET ALL PAGES (ONLY ONE EXPECTED)
   GET /api/sponsored-research
---------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const pages = await SponsoredResearchSEO.find().sort({
      createdAt: -1,
    });

    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------------------------------
   GET SINGLE PAGE BY ID
   GET /api/sponsored-research/:id
---------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const page = await SponsoredResearchSEO.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        message: "Sponsored Research page not found",
      });
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------------------------------
   UPDATE PAGE (BANNER + CONTENT)
   PUT /api/sponsored-research/:id
---------------------------------------------------- */
router.put(
  "/:id",
  upload.single("banner_image"),
  async (req, res) => {
    try {
      const updateData = {
        /* SEO */
        meta_title: req.body.meta_title || "",
        meta_description: req.body.meta_description || "",
        meta_keywords: req.body.meta_keywords || "",
        meta_canonical: req.body.meta_canonical || "",

        /* Banner */
        banner_text: req.body.banner_text || "",

        /* CONTENT SECTIONS */
        sponsored_research: req.body.sponsored_research || "",
        advisory_services: req.body.advisory_services || "",
      };

      if (req.file) {
        updateData.banner_image =
          `/uploads/sponsored-research/${req.file.filename}`;
      }

      const updatedPage =
        await SponsoredResearchSEO.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );

      if (!updatedPage) {
        return res.status(404).json({
          message: "Sponsored Research page not found",
        });
      }

      res.json({
        success: true,
        message:
          "Sponsored Research & Advisory Services updated successfully",
        data: updatedPage,
      });
    } catch (err) {
      console.error("Update Error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
