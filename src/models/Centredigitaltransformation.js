import mongoose from "mongoose";

const CentreDigitalTransformationSchema = new mongoose.Schema(
  {
    /* =========================
       PAGE IDENTITY
    ========================= */
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

    /* =========================
       SEO META FIELDS
    ========================= */
    meta_title: {
      type: String,
      trim: true,
      maxlength: 60,
      default: "",
    },

    meta_description: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
    },

    meta_keywords: {
      type: String,
      trim: true,
      default: "",
    },

    meta_canonical: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================
       BANNER
    ========================= */
    banner_image: {
      type: String,
      default: "",
    },

    banner_text: {
      type: String,
      default: "",
    },

    /* =========================
       PAGE CONTENT
       (TinyMCE HTML)
    ========================= */
    about_details: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/* 👇 FORCE COLLECTION NAME */
export default mongoose.model(
  "Centredigitaltransformation",
  CentreDigitalTransformationSchema,
  "centre_digital_transformation_seo"
);
