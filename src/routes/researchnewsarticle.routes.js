import express from "express";
import ResearchNewsArticle from "../models/Researchnewsarticle.js";

const router = express.Router();

/* =====================================================
   GET ALL NEWS ARTICLES
   GET /api/research-news-article
===================================================== */
router.get("/", async (req, res) => {
  try {
    const filter = { isDeleted: false };

    if (req.query.year) {
      filter.year = req.query.year;
    }

    const articles = await ResearchNewsArticle.find(filter).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   GET SINGLE NEWS ARTICLE
   GET /api/research-news-article/:id
================================ */
router.get("/:id", async (req, res) => {
  try {
    const article = await ResearchNewsArticle.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "News article not found",
      });
    }

    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   ADD NEWS ARTICLE
   POST /api/research-news-article
================================ */
router.post("/", async (req, res) => {
  try {
    const { year, content } = req.body;

    if (!year || !content) {
      return res.status(400).json({
        success: false,
        message: "Year and content are required",
      });
    }

    const newArticle = await ResearchNewsArticle.create({
      year,
      content,
    });

    res.status(201).json({ success: true, data: newArticle });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   UPDATE NEWS ARTICLE
   PUT /api/research-news-article/:id
================================ */
router.put("/:id", async (req, res) => {
  try {
    const article = await ResearchNewsArticle.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "News article not found",
      });
    }

    const fields = ["year", "content"];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        article[field] = req.body[field];
      }
    });

    await article.save();

    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===============================
   SOFT DELETE NEWS ARTICLE
   DELETE /api/research-news-article/:id
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const article = await ResearchNewsArticle.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "News article not found",
      });
    }

    article.isDeleted = true;
    article.deletedAt = new Date();
    await article.save();

    res.json({
      success: true,
      message: "News article deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
