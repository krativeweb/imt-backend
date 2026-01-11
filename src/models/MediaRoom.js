import mongoose from "mongoose";

const mediaRoomSchema = new mongoose.Schema(
  {
    /* ---------------- MEDIA BASIC INFO ---------------- */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
      index: true, // useful for sorting by year
    },

    /* ---------------- CONTENT (TinyMCE / CmsEditor HTML) ---------------- */
    content: {
      type: String,
      required: true,
      default: "",
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
  "MediaRoom",
  mediaRoomSchema,
  "media_room"
);
