import mongoose from "mongoose";

const PgdmAdmissionSchema = new mongoose.Schema(
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

    /* ---------------- CONTENT SECTIONS ---------------- */
    features_section: {
      type: String,
      default: "",
    },

    advantage_of_imt_hyderabad: {
      type: String,
      default: "",
    },

    advantage_of_imt_blocks: {
      type: String,
      default: "",
    },

    impeccable_placement: {
      type: String,
      default: "",
    },

    elligibility: {
      type: String,
      default: "",
    },

    remember_important_dates: {
      type: String,
      default: "",
    },

    admission_process: {
      type: String,
      default: "",
    },

    admission_information: {
      type: String,
      default: "",
    },

    program_highlights: {
      type: String,
      default: "",
    },

    life_imt_Hyderabad_campus: {
      type: String,
      default: "",
    },

    /* ---------------- MULTIPLE IMAGES ---------------- */

    // Accreditation & Approvals
    accreditation_images: {
      type: [String],
      default: [],
    },

    // Life @ IMT Hyderabad Campus Images
    life_imt_Hyderabad_images: {
      type: [String],
      default: [],
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
  { timestamps: true }
);

/* 👇 Clean model & collection naming */
export default mongoose.model(
  "PgdmAdmission",
  PgdmAdmissionSchema,
  "pgdm_admission"
);
