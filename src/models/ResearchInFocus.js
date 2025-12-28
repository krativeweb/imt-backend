import mongoose from "mongoose";

const researchInFocusSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC INFO
    ========================== */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    home_title: {
      type: String,
      required: true,
      trim: true,
    },

    details_page_title: {
      type: String,
      trim: true,
    },

    sub_title: {
      type: String,
      trim: true,
    },

    /* =========================
       CONTENT
    ========================== */
    short_description: {
      type: String,
      trim: true,
    },

    main_description: {
      type: String,
      trim: true,
    },

    image: {
      type: String, // home image
    },

    details_banner_image: {
      type: String, // details page banner
    },

    /* =========================
       SEO FIELDS
    ========================== */
    page_title: {
      type: String,
      trim: true,
    },

    page_slug: {
      type: String,
      trim: true,
      unique: true,
    },

    meta_title: {
      type: String,
      trim: true,
      maxlength: 60,
    },

    meta_keywords: {
      type: String,
      trim: true,
    },

    meta_description: {
      type: String,
      trim: true,
      maxlength: 160,
    },

    meta_canonical: {
      type: String,
      trim: true,
    },

    /* =========================
       BANNER
    ========================== */
    banner_text: {
      type: String,
      trim: true,
    },

    /* =========================
       SOFT DELETE
    ========================== */
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

// 👇 FORCE COLLECTION NAME
export default mongoose.model(
  "ResearchInFocus",
  researchInFocusSchema,
  "researchinfocus"
);
