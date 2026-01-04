import express from "express";
import ResearchConferenceProceeding from "../models/Researchconferenceproceeding.js";

const router = express.Router();

/* =====================================================
   GET ALL CONFERENCE PROCEEDINGS
   GET /api/research-conference-proceeding
===================================================== */
router.get("/", async (req, res) => {
  try {
    const filter = { isDeleted: false };

    if (req.query.year) {
      filter.year = req.query.year;
    }

    const proceedings = await ResearchConferenceProceeding.find(filter).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: proceedings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   GET SINGLE PROCEEDING
   GET /api/research-conference-proceeding/:id
================================ */
router.get("/:id", async (req, res) => {
  try {
    const item = await ResearchConferenceProceeding.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Conference proceeding not found",
      });
    }

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   ADD CONFERENCE PROCEEDING
   POST /api/research-conference-proceeding
================================ */
router.post("/", async (req, res) => {
  try {
    const {
      author_name,
      article_title,
      published_presented,
      year,
    } = req.body;

    if (
      !author_name ||
      !article_title ||
      !published_presented ||
      !year
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const newProceeding = await ResearchConferenceProceeding.create({
      author_name,
      article_title,
      published_presented,
      year,
    });

    res.status(201).json({ success: true, data: newProceeding });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   UPDATE CONFERENCE PROCEEDING
   PUT /api/research-conference-proceeding/:id
================================ */
router.put("/:id", async (req, res) => {
  try {
    const item = await ResearchConferenceProceeding.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Conference proceeding not found",
      });
    }

    const fields = [
      "author_name",
      "article_title",
      "published_presented",
      "year",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   SOFT DELETE CONFERENCE PROCEEDING
   DELETE /api/research-conference-proceeding/:id
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const item = await ResearchConferenceProceeding.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Conference proceeding not found",
      });
    }

    item.isDeleted = true;
    item.deletedAt = new Date();
    await item.save();

    res.json({
      success: true,
      message: "Conference proceeding deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
