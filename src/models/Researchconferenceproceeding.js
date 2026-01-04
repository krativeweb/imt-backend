import mongoose from "mongoose";

const researchConferenceProceedingSchema = new mongoose.Schema(
  {
    /* -------------------------
       AUTHOR NAME
       Example: Prof. Krishna Dixit
    ------------------------- */
    author_name: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       ARTICLE TITLE
    ------------------------- */
    article_title: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       PUBLISHED / PRESENTED
       Conference / Seminar details
    ------------------------- */
    published_presented: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       YEAR
       Example: 2025 or 26–28 Feb 2025
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
  "Researchconferenceproceeding",      // Model name
  researchConferenceProceedingSchema,
  "research_conference_proceeding"     // Collection name
);
