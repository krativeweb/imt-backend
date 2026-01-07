import mongoose from "mongoose";

const FellowProgramAdmissionSchema = new mongoose.Schema(
  {
    /* ================= SEO ================= */
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

    /* ================= BANNER ================= */
    banner_image: {
      type: String,
      default: "",
    },

    banner_text: {
      type: String,
      default: "",
    },

    /* ================= FPM ADMISSION CONTENT ================= */
    program_overview: {
      type: String,
      default: "",
    },

    specializations: {
      type: String,
      default: "",
    },

    admission_process: {
      type: String,
      default: "",
    },

    financial_aid: {
      type: String,
      default: "",
    },

    aicte_approval: {
      type: String,
      default: "",
    },

    contact_us: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/* 👇 Clean model & collection naming */
export default mongoose.model(
  "FellowprograminmanagementTwo",
  FellowProgramAdmissionSchema,
  "fellow_program_management_admission_seo"
);
