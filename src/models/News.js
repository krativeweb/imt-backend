import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    content: { type: String, default: "" },
    isDel: { type: Boolean, default: false }, // soft delete
  },
  { timestamps: true }
);

export default mongoose.models.News || mongoose.model("News", NewsSchema);
