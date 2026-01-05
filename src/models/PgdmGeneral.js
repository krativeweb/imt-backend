import mongoose from "mongoose";

const PgdmGeneralSchema = new mongoose.Schema(
  {
    /* ---------------- SEO ---------------- */
    page_title: {
      type: String,
      required: true,
      trim: true,
    },

    page_slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    meta_title: {
      type: String,
      trim: true,
      maxlength: 60,
    },

    meta_description: {
      type: String,
      trim: true,
      maxlength: 160,
    },

    meta_keywords: {
      type: String,
      trim: true,
    },

    meta_canonical: {
      type: String,
      trim: true,
    },

    /* ---------------- BANNER ---------------- */
    banner_image: {
      type: String,
      default: "",
    },

    banner_text: {
      type: String,
      default: "",
    },

    /* ---------------- PGDM GENERAL CONTENT ---------------- */
    curriculum: {
      type: String,
      default: "",
    },

    key_features: {
      type: String,
      default: "",
    },

    program_outcome: {
      type: String,
      default: "",
    },

    pedagogy: {
      type: String,
      default: "",
    },

    career_opportunities: {
      type: String,
      default: "",
    },

    competency_goal: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

/* 👇 Clean model & collection naming */
export default mongoose.model(
  "PgdmGeneral",
  PgdmGeneralSchema,
  "pgdm_general_seo"
);
