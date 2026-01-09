import mongoose from "mongoose";

const studentTutorialSchema = new mongoose.Schema(
  {
    /* ---------------- BASIC INFO ---------------- */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    /* ---------------- SOFT DELETE ---------------- */
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

/* 👇 FORCE COLLECTION NAME */
export default mongoose.model(
  "StudentTutorials",     // Model name
  studentTutorialSchema,
  "student_tutorials"     // Collection name
);
