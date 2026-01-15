import mongoose from "mongoose";

const eventCalendarSchema = new mongoose.Schema(
  {
    event_date: {
      type: Date,
      required: true,
    },

    start_time: {
      type: String, // "09:30"
      required: true,
    },

    end_time: {
      type: String, // "11:00"
      required: true,
      validate: {
        validator: function (value) {
          return value > this.start_time;
        },
        message: "End time must be after start time",
      },
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
  "EventCalendar",
  eventCalendarSchema,
  "event_calendar"
);
