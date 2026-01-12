import mongoose from "mongoose";

const HappeningsSeoSchema = new mongoose.Schema(
  {
    /* ---------------- PAGE INFO ---------------- */
    page_title: {
      type: String,
      required: true,
      trim: true,
    },

    page_slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    /* ---------------- SEO META ---------------- */
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

    /* ---------------- BANNER IMAGE ---------------- */
    banner_image: {
      type: String, // stores image path
      default: "",
    },

    /* ---------------- BANNER TEXT ---------------- */
    banner_text: {
      type: String, // HTML from TinyMCE
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "HappeningsSeo",
  HappeningsSeoSchema,
  "happenings_seo"
);
