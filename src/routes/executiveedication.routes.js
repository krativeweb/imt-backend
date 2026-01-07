import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ExecutiveEducation from "../models/ExecutiveEdication.js";

const router = express.Router();

/* ----------------------------------------------------
   UPLOAD DIRECTORY
---------------------------------------------------- */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "executive-education"
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
      "banner-" +
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
   GET ALL (CMS PAGES)
---------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const pages = await ExecutiveEducation.find({ isDeleted: false })
      .sort({ createdAt: -1 });

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
    const page = await ExecutiveEducation.findById(req.params.id);

    if (!page || page.isDeleted) {
      return res.status(404).json({
        message: "Executive Education page not found",
      });
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------------------------------
   UPDATE PAGE (FORMDATA SAFE)
---------------------------------------------------- */
router.put(
  "/:id",
  upload.single("banner_image"),
  async (req, res) => {
    try {
      const updateData = {
        /* PAGE */
        page_title: req.body.page_title,
        page_slug: req.body.page_slug,

        /* SEO */
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        meta_keywords: req.body.meta_keywords,
        meta_canonical: req.body.meta_canonical,

        /* CONTACT */
        email: req.body.email,
        contact: req.body.contact,

        /* CONTENT */
        banner_text: req.body.banner_text,
        introduction: req.body.introduction,
        edp_calender: req.body.edp_calender,
        short_during_program: req.body.short_during_program,
        long_during_program: req.body.long_during_program,
        first_time_manager_program:
          req.body.first_time_manager_program,
        certificate_program: req.body.certificate_program,
      };

      /* IMAGE */
      if (req.file) {
        updateData.banner_image =
          `/uploads/executive-education/${req.file.filename}`;
      }

      /* REMOVE UNDEFINED (CRITICAL) */
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key]
      );

      const updatedPage =
        await ExecutiveEducation.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );

      if (!updatedPage) {
        return res.status(404).json({
          message: "Executive Education page not found",
        });
      }

      res.json({
        success: true,
        message: "Executive Education page updated successfully",
        data: updatedPage,
      });
    } catch (err) {
      console.error("Update Error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
