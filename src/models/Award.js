import mongoose from "mongoose";

const awardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Awards for Institute", "Awards for Director"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String, // uploads/awards/filename.jpg
      required: true,
    },

    // SOFT DELETE
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

export default mongoose.model("Award", awardSchema);
