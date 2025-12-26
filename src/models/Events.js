import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    event_date: {
      type: Date,
      required: true,
    },

    event_time: {
      type: String, // "14:30"
      required: true,
    },

    event_title: {
      type: String,
      required: true,
      trim: true,
    },

    event_place: {
      type: String,
      required: true,
      trim: true,
    },

    /* 🔹 SOFT DELETE */
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

// 👇 FORCE COLLECTION NAME
export default mongoose.model(
  "Events",
  eventSchema,
  "events"
);
