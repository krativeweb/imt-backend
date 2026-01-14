import mongoose from "mongoose";

const committeesImtDataSchema = new mongoose.Schema(
  {
    /* -----------------------------
       TAB / COMMITTEE DETAILS
    ------------------------------ */
    tab_title: {
      type: String,
      required: true,
      trim: true,
    },

    tab_image: {
      type: String,
      required: true,
    },

    tab_content: {
      type: String,
      required: true,
    },

    tab_main_image: {
      type: String,
      required: true,
    },

    /* -----------------------------
       COMMITTEE IMAGES (MULTIPLE)
       (used as "our_events" in UI)
    ------------------------------ */
    our_events: {
      type: [String],
      default: [],
    },

    /* -----------------------------
       SOFT DELETE
    ------------------------------ */
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
  "Committeesimtdata",
  committeesImtDataSchema,
  "committees_imt_data"
);
