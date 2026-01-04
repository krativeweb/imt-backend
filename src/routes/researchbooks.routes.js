import express from "express";
import ResearchBooks from "../models/Researchbooks.js";

const router = express.Router();

/* =====================================================
   GET ALL RESEARCH BOOKS
   GET /api/research-books
===================================================== */
router.get("/", async (req, res) => {
  try {
    const filter = { isDeleted: false };

    if (req.query.year) {
      filter.year = req.query.year;
    }

    const books = await ResearchBooks.find(filter).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: books });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   GET SINGLE BOOK
   GET /api/research-books/:id
================================ */
router.get("/:id", async (req, res) => {
  try {
    const book = await ResearchBooks.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Research book not found",
      });
    }

    res.json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD RESEARCH BOOK
   POST /api/research-books
================================ */
router.post("/", async (req, res) => {
  try {
    const {
      author_name,
      book_name,
      chapter_edited,
      published,
      year,
    } = req.body;

    if (
      !author_name ||
      !book_name ||
      !chapter_edited ||
      !published ||
      !year
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const newBook = await ResearchBooks.create({
      author_name,
      book_name,
      chapter_edited,
      published,
      year,
    });

    res.status(201).json({
      success: true,
      data: newBook,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE RESEARCH BOOK
   PUT /api/research-books/:id
================================ */
router.put("/:id", async (req, res) => {
  try {
    const book = await ResearchBooks.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Research book not found",
      });
    }

    const fields = [
      "author_name",
      "book_name",
      "chapter_edited",
      "published",
      "year",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        book[field] = req.body[field];
      }
    });

    await book.save();

    res.json({
      success: true,
      data: book,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   SOFT DELETE RESEARCH BOOK
   DELETE /api/research-books/:id
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const book = await ResearchBooks.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Research book not found",
      });
    }

    book.isDeleted = true;
    book.deletedAt = new Date();
    await book.save();

    res.json({
      success: true,
      message: "Research book deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
