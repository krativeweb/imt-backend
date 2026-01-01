import mongoose from "mongoose";

const InternationalAssociationGallerySchema = new mongoose.Schema(
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
    isDel: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.InternationalAssociationGallery ||
  mongoose.model(
    "InternationalAssociationGallery",
    InternationalAssociationGallerySchema
  );
