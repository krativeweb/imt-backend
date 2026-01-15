import mongoose from "mongoose";

const EventGallerySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true, // image required when adding
      trim: true,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    isDel: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.EventGallery ||
  mongoose.model("EventGallery", EventGallerySchema);
