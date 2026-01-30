import mongoose from "mongoose";

const HappeningsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one image is required",
      },
    },

    description: {
      type: String,
      required: true,
    },

    // ✅ DATE USED FOR SORTING
    sortDate: {
      type: Date,
      required: true,
      index: true, // important for sorting performance
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

export default mongoose.model("Happenings", HappeningsSchema, "happenings");
