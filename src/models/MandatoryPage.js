import mongoose from "mongoose";

const mandatoryPageSchema = new mongoose.Schema(
  {
    page_title: String,
    page_slug: String,
    page_parent: String,
    meta_title: String,
    meta_description: String,
    meta_keywords: String,
    meta_canonical: String,
    banner_image: String,
    banner_text: String,
    page_content: String,
    gallery_images: {
      type: [String], // Array of strings
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("MandatoryPage", mandatoryPageSchema);
