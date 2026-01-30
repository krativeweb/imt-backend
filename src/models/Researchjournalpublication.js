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
       SORT / PUBLICATION DATE
       Used for ordering (DESC)
    ------------------------- */
    sortDate: {
      type: Date,
      required: true,
      index: true, // 🔑 important for sorting
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
       AUTHORS (comma separated)
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
       VOLUME
    ------------------------- */
    volume: {
      type: String,
      trim: true,
    },

    /* -------------------------
       PUBLICATION URL
    ------------------------- */
    publication_url: {
      type: String,
      trim: true,
      default: "",
    },

    /* -------------------------
       ABSTRACT (TinyMCE HTML)
       ❗ DO NOT trim
    ------------------------- */
    abstract: {
      type: String,
      required: true,
    },

    /* -------------------------
       AUTHOR IMAGE (FILE PATH)
    ------------------------- */
    image: {
      type: String,
      default: "",
    },

    /* -------------------------
       SOFT DELETE
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

/* 🚀 INDEX FOR FAST SORTING */
researchJournalPublicationSchema.index({ sortDate: -1 });

/* 👇 FORCE COLLECTION NAME */
export default mongoose.model(
  "Researchjournalpublication",
  researchJournalPublicationSchema,
  "research_journal_publication"
);
