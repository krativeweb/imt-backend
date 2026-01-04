import express from "express";
import ResearchMagazines from "../models/Researchmagazines.js";

const router = express.Router();

/* =====================================================
   GET ALL RESEARCH MAGAZINES
   GET /api/research-magazines
===================================================== */
router.get("/", async (req, res) => {
  try {
    const filter = { isDeleted: false };

    if (req.query.year) {
      filter.year = req.query.year;
    }

    const magazines = await ResearchMagazines.find(filter).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: magazines });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   GET SINGLE MAGAZINE
   GET /api/research-magazines/:id
================================ */
router.get("/:id", async (req, res) => {
  try {
    const magazine = await ResearchMagazines.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!magazine) {
      return res.status(404).json({
        success: false,
        message: "Research magazine not found",
      });
    }

    res.json({ success: true, data: magazine });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD RESEARCH MAGAZINE
   POST /api/research-magazines
================================ */
router.post("/", async (req, res) => {
  try {
    const {
      author_name,
      article_title,
      publisher,
      year,
    } = req.body;

    if (!author_name || !article_title || !publisher || !year) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const newMagazine = await ResearchMagazines.create({
      author_name,
      article_title,
      publisher,
      year,
    });

    res.status(201).json({
      success: true,
      data: newMagazine,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE RESEARCH MAGAZINE
   PUT /api/research-magazines/:id
================================ */
router.put("/:id", async (req, res) => {
  try {
    const magazine = await ResearchMagazines.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!magazine) {
      return res.status(404).json({
        success: false,
        message: "Research magazine not found",
      });
    }

    const fields = [
      "author_name",
      "article_title",
      "publisher",
      "year",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        magazine[field] = req.body[field];
      }
    });

    await magazine.save();

    res.json({
      success: true,
      data: magazine,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   SOFT DELETE RESEARCH MAGAZINE
   DELETE /api/research-magazines/:id
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const magazine = await ResearchMagazines.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!magazine) {
      return res.status(404).json({
        success: false,
        message: "Research magazine not found",
      });
    }

    magazine.isDeleted = true;
    magazine.deletedAt = new Date();
    await magazine.save();

    res.json({
      success: true,
      message: "Research magazine deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
