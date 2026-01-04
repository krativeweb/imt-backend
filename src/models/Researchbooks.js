import mongoose from "mongoose";

const researchBooksSchema = new mongoose.Schema(
  {
    /* -------------------------
       AUTHOR NAME
       Example: Khalidullah Mohammed Baharul Islam
    ------------------------- */
    author_name: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       NAME OF THE BOOK
       Example: Handbook of Human Factors and Ergonomics
    ------------------------- */
    book_name: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       CHAPTER EDITED IN THE BOOK
       Example: Human Factors and Ergonomics in Business
    ------------------------- */
    chapter_edited: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       PUBLISHED
       Example: CRC Press, Springer, Routledge
    ------------------------- */
    published: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       YEAR
       Example: 2025-26
    ------------------------- */
    year: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       SOFT DELETE SUPPORT
    ------------------------- */
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* 👇 FORCE COLLECTION NAME */
export default mongoose.model(
  "Researchbooks",          // Model name
  researchBooksSchema,
  "research_books"          // Collection name
);
