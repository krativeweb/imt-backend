import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
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

    /* ---------------- SOFT DELETE ---------------- */
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/* 👇 Clean model & collection naming */
export default mongoose.model(
  "Media",
  MediaSchema,
  "media"
);
