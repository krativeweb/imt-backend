import mongoose from "mongoose";

const researchMagazinesSchema = new mongoose.Schema(
  {
    /* -------------------------
       AUTHOR NAME
       Example: Dr. A. K. Sharma
    ------------------------- */
    author_name: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       TITLE OF THE ARTICLE
       Example: Advances in AI for Healthcare
    ------------------------- */
    article_title: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       PUBLISHER
       Example: Nature, IEEE, Elsevier
    ------------------------- */
    publisher: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       YEAR
       Example: 2024-25
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
  "Researchmagazines",     // Model name
  researchMagazinesSchema,
  "research_magazines"    // Collection name
);
