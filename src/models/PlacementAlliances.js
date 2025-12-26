import mongoose from "mongoose";

const placementAllianceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
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
  "PlacementAlliances",
  placementAllianceSchema,
  "placement_alliances"
);
