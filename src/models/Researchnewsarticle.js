import mongoose from "mongoose";

const researchNewsArticleSchema = new mongoose.Schema(
  {
    /* -------------------------
       ACADEMIC YEAR
       Example: 2024-25
    ------------------------- */
    year: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       NEWS ARTICLE CONTENT
       HTML content from TinyMCE
    ------------------------- */
    content: {
      type: String,
      required: true,
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
  "Researchnewsarticle",       // Model name
  researchNewsArticleSchema,
  "research_news_article"      // Collection name
);
