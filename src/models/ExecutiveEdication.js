import mongoose from "mongoose";

const executiveEducationSchema = new mongoose.Schema(
  {
    /* ===============================
       PAGE INFO
    =============================== */
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

    /* ===============================
       SEO FIELDS
    =============================== */
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

    /* ===============================
       CONTACT INFO
    =============================== */
    email: {
      type: String,
      trim: true,
    },

    contact: {
      type: String,
      trim: true,
    },

    /* ===============================
       BANNER
    =============================== */
    banner_image: {
      type: String, // stored file path
      default: "",
    },

    banner_text: {
      type: String, // TinyMCE HTML
    },

    /* ===============================
       PAGE CONTENT (TINYMCE)
    =============================== */
    introduction: {
      type: String,
    },

    edp_calender: {
      type: String,
    },

    short_during_program: {
      type: String,
    },

    long_during_program: {
      type: String,
    },

    first_time_manager_program: {
      type: String,
    },

    certificate_program: {
      type: String,
    },

    /* ===============================
       SOFT DELETE
    =============================== */
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
  "ExecutiveEdication",        // Model name
  executiveEducationSchema,
  "executive_education"        // Collection name
);
