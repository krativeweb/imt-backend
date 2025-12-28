import mongoose from "mongoose";

const HomeSeoSchema = new mongoose.Schema(
  {
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

    /* 🔥 CHANGED: IMAGE → VIDEO */
    banner_video: {
      type: String, // stores video file path
      default: "",
    },

    banner_text: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("HomeSeo", HomeSeoSchema);
