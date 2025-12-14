import mongoose from "mongoose";

const PhotoGallerySchema = new mongoose.Schema(
  {
    image: {
      type: String,
     
    },
    content: {
      type: String,
      default: "",
    },
    isDel: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.models.PhotoGallery ||
  mongoose.model("PhotoGallery", PhotoGallerySchema);
