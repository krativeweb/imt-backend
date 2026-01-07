import mongoose from "mongoose";

const studentsOnRollSchema = new mongoose.Schema(
  {
    /* ---------------- BASIC INFO ---------------- */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    joining_year: {
      type: Number,
      required: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    research_interests: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    /* ---------------- BIO (TinyMCE HTML) ---------------- */
    bio: {
      type: String,
      default: "",
    },

    /* ---------------- PROFILE IMAGE ---------------- */
    image: {
      type: String,
      required: true,
    },

    /* ---------------- SOFT DELETE SUPPORT ---------------- */
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
  "StudentonRole",
  studentsOnRollSchema,
  "students_on_roll"
);
