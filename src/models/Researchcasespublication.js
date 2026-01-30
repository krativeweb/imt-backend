import mongoose from "mongoose";

const researchCasesPublicationSchema = new mongoose.Schema(
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
      index: true, // 🔑 important for sorting performance
    },

    /* -------------------------
       NAME (Primary Author / Faculty)
    ------------------------- */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       CASE TITLE
    ------------------------- */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       AUTHORS (Comma separated)
    ------------------------- */
    authors: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       PUBLISHER
       Example: Ivey, Harvard, etc.
    ------------------------- */
    publisher: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       REFERENCE NO
       Example: W44788
    ------------------------- */
    reference: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       CASE URL
    ------------------------- */
    case_url: {
      type: String,
      trim: true,
      default: "",
    },

    /* -------------------------
       ABSTRACT (HTML from editor)
       ❗ DO NOT trim
    ------------------------- */
    abstract: {
      type: String,
      required: true,
    },

    /* -------------------------
       PROFILE / CASE IMAGE
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

/* 🚀 INDEX FOR FAST SORTING BY DATE */
researchCasesPublicationSchema.index({ sortDate: -1 });

/* 👇 FORCE COLLECTION NAME */
export default mongoose.model(
  "ResearchCasesPublication",     // Model name
  researchCasesPublicationSchema,
  "research_cases_publication"    // Collection name
);
