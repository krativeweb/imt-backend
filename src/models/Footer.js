import mongoose from "mongoose";

const FooterSchema = new mongoose.Schema(
  {
    /* ---------------- CONTACT INFO ---------------- */
    address: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    /* ---------------- SOCIAL LINKS ---------------- */
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

    instagram_url: {
      type: String,
      trim: true,
      default: "",
    },

    youtube_url: {
      type: String,
      trim: true,
      default: "",
    },

    /* ---------------- ACCREDITATIONS & APPROVALS ---------------- */
    accreditations: {
      type: [String], // image paths
      default: [],
    },

    /* ---------------- MEMBERS ---------------- */
    members: {
      type: [String], // image paths
      default: [],
    },

    /* ---------------- COPYRIGHT ---------------- */
    copyright_text: {
      type: String, // HTML from TinyMCE
      default: "",
    },

    /* ---------------- SOFT DELETE (OPTIONAL) ---------------- */
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

/* 👇 Clean model & collection naming */
export default mongoose.model(
  "Footer",
  FooterSchema,
  "footer"
);
