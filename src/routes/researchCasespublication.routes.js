import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ResearchCasesPublication from "../models/Researchcasespublication.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "research-cases-publication"
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
    const name = `case-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

/* =====================================================
   GET ALL CASE PUBLICATIONS
   GET /api/research-cases-publication
===================================================== */
router.get("/", async (req, res) => {
  try {
    const filter = { isDeleted: false };

    if (req.query.year) {
      filter.academic_year = req.query.year;
    }

    const cases = await ResearchCasesPublication.find(filter).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: cases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   GET SINGLE CASE
================================ */
router.get("/:id", async (req, res) => {
  try {
    const caseItem = await ResearchCasesPublication.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: "Case publication not found",
      });
    }

    res.json({ success: true, data: caseItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   ADD CASE PUBLICATION
================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      academic_year,
      name,
      title,
      authors,
      publisher,
      reference,
      case_url,
      abstract,
    } = req.body;

    if (
      !academic_year ||
      !name ||
      !title ||
      !authors ||
      !publisher ||
      !reference ||
      !abstract
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const newCase = await ResearchCasesPublication.create({
      academic_year,
      name,
      title,
      authors,
      publisher,
      reference,
      case_url,
      abstract,
      image: req.file
        ? `uploads/research-cases-publication/${req.file.filename}`
        : "",
    });

    res.status(201).json({ success: true, data: newCase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   UPDATE CASE PUBLICATION
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const caseItem = await ResearchCasesPublication.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: "Case publication not found",
      });
    }

    const fields = [
      "academic_year",
      "name",
      "title",
      "authors",
      "publisher",
      "reference",
      "case_url",
      "abstract",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        caseItem[field] = req.body[field];
      }
    });

    if (req.file) {
      caseItem.image = `uploads/research-cases-publication/${req.file.filename}`;
    }

    await caseItem.save();

    res.json({ success: true, data: caseItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   SOFT DELETE CASE
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const caseItem = await ResearchCasesPublication.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: "Case publication not found",
      });
    }

    caseItem.isDeleted = true;
    caseItem.deletedAt = new Date();
    await caseItem.save();

    res.json({
      success: true,
      message: "Case publication deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
