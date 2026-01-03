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

/* 👇 FORCE COLLECTION NAME */
export default mongoose.model(
  "ResearchCasesPublication",     // Model name
  researchCasesPublicationSchema,
  "research_cases_publication"    // Collection name
);
