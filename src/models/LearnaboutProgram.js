import mongoose from "mongoose";

const learnAboutProgramSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    video_url: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------- Soft Delete (optional, same pattern) -------- */
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
  "LearnaboutProgram",
  learnAboutProgramSchema,
  "learn_about_program"
);
