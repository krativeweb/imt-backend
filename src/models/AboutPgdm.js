import mongoose from "mongoose";

const AboutPgdmSEOSchema = new mongoose.Schema(
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

    /* ---------------- PGDM CONTENT ---------------- */
    introduction: {
      type: String,
      default: "",
    },

    program_uniqueness: {
      type: String,
      default: "",
    },

    specializations: {
      type: String,
      default: "",
    },

    program_structure: {
      type: String,
      default: "",
    },

    academic_calendar: {
      type: String,
      default: "",
    },

    placement: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

/* 👇 Clean model & collection naming */
export default mongoose.model(
  "AboutPgdm",
  AboutPgdmSEOSchema,
  "about_pgdm_seo"
);
