import mongoose from "mongoose";

const FacultyPageSEOSchema = new mongoose.Schema(
  {
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

    banner_image: {
      type: String,
      default: "",
    },

    banner_text: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("FacultyPageSEO", FacultyPageSEOSchema);
