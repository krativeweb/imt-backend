import mongoose from "mongoose";

const conferenceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
      trim: true,
    },

    conference: {
      type: String,
      required: true,
      trim: true,
    },

    theme: {
      type: String,
      required: true,
      trim: true,
    },

    support: {
      type: String,
      trim: true,
      default: "",
    },

    journal: {
      type: String,
      trim: true,
      default: "",
    },

    brochure: {
      type: String,
      trim: true,
      default: "",
    },

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
  "ConferenceDetails",
  conferenceSchema,
  "conferences"
);
