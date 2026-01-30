import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ResearchJournalPublication from "../models/Researchjournalpublication.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "research-journal-publication"
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
    const name = `journal-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

/* =====================================================
   GET ALL JOURNAL PUBLICATIONS
   SORT BY sortDate DESC
===================================================== */
router.get("/", async (req, res) => {
  try {
    const filter = { isDeleted: false };

    if (req.query.year) {
      filter.academic_year = req.query.year;
    }

    const publications = await ResearchJournalPublication.find(filter)
      .sort({ sortDate: -1 }); // ✅ DATE SORT

    res.json({
      success: true,
      data: publications,
    });
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
    const publication = await ResearchJournalPublication.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    res.json({
      success: true,
      data: publication,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD JOURNAL PUBLICATION
================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      academic_year,
      sortDate,
      author_name,
      publication_title,
      authors,
      journal_name,
      volume,
      publication_url,
      abstract,
    } = req.body;

    /* REQUIRED FIELD CHECK */
    if (
      !academic_year ||
      !sortDate ||
      !author_name ||
      !publication_title ||
      !authors ||
      !journal_name ||
      !abstract
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const publication = await ResearchJournalPublication.create({
      academic_year,
      sortDate: new Date(sortDate), // ✅ IMPORTANT
      author_name,
      publication_title,
      authors,
      journal_name,
      volume: volume || "",
      publication_url: publication_url || "",
      abstract,
      image: req.file
        ? `uploads/research-journal-publication/${req.file.filename}`
        : "",
    });

    res.status(201).json({
      success: true,
      data: publication,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE JOURNAL PUBLICATION
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const publication = await ResearchJournalPublication.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    /* ----------------------------
       NORMAL FIELD UPDATES
    ---------------------------- */
    const fields = [
      "academic_year",
      "author_name",
      "publication_title",
      "authors",
      "journal_name",
      "publication_url",
      "abstract",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        publication[field] = req.body[field];
      }
    });

    /* ----------------------------
       SORT DATE UPDATE
    ---------------------------- */
    if (req.body.sortDate) {
      publication.sortDate = new Date(req.body.sortDate); // ✅
    }

    /* ----------------------------
       VOLUME
    ---------------------------- */
    if (req.body.volume !== undefined) {
      publication.volume =
        req.body.volume === "" ? undefined : req.body.volume;
    }

    /* ----------------------------
       IMAGE UPDATE
    ---------------------------- */
    if (req.file) {
      publication.image = `uploads/research-journal-publication/${req.file.filename}`;
    }

    await publication.save();

    res.json({
      success: true,
      data: publication,
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
    const publication = await ResearchJournalPublication.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    publication.isDeleted = true;
    publication.deletedAt = new Date();
    await publication.save();

    res.json({
      success: true,
      message: "Publication deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
