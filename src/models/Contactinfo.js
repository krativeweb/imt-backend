import mongoose from "mongoose";

const ContactInfoSchema = new mongoose.Schema(
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

    /* ---------------- ADMISSION ---------------- */
    admission_pgdm_email: {
      type: String,
      trim: true,
      default: "",
    },

    admission_fpm_email: {
      type: String,
      trim: true,
      default: "",
    },

    admission_phone: {
      type: String,
      trim: true,
      default: "",
    },

    admission_mobile: {
      type: String,
      trim: true,
      default: "",
    },

    /* ---------------- CORPORATE RELATIONS GROUP ---------------- */
    crg_email: {
      type: String,
      trim: true,
      default: "",
    },

    crg_phone: {
      type: String,
      trim: true,
      default: "",
    },

    crg_mobile: {
      type: String,
      trim: true,
      default: "",
    },

    /* ---------------- SOCIAL LINKS ---------------- */
    instagram_url: {
      type: String,
      trim: true,
      default: "",
    },

    facebook_url: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin_url: {
      type: String,
      trim: true,
      default: "",
    },

    youtube_url: {
      type: String,
      trim: true,
      default: "",
    },

    /* ---------------- MAP ---------------- */
    map_address: {
      type: String,
      trim: true,
      default: "",
    },

    map_embed_url: {
      type: String,
      trim: true,
      default: "",
    },

    /* ---------------- OPTIONAL SOFT DELETE ---------------- */
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
  "Contactinfo",
  ContactInfoSchema,
  "contact_info"
);
