import mongoose from "mongoose";

const researchJournalPublicationSchema = new mongoose.Schema(
  {
    /* -------------------------
       ACADEMIC YEAR
       Example: 2025-26
    ------------------------- */
    academic_year: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       AUTHOR / FACULTY NAME
    ------------------------- */
    author_name: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       PUBLICATION TITLE
    ------------------------- */
    publication_title: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       AUTHORS
       (Comma-separated string)
    ------------------------- */
    authors: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       JOURNAL NAME
    ------------------------- */
    journal_name: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       PUBLICATION URL
    ------------------------- */
    publication_url: {
      type: String,
      trim: true,
    },

    /* -------------------------
       ABSTRACT
    ------------------------- */
    abstract: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       AUTHOR IMAGE
    ------------------------- */
    image: {
      type: String,
      default: "",
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
  "Researchjournalpublication",
  researchJournalPublicationSchema,
  "research_journal_publication"
);
