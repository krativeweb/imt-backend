import mongoose from "mongoose";

const uspSectionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Only ONE USP document
export default mongoose.model("UspSection", uspSectionSchema);
