import mongoose from "mongoose";

const HomeSeoSchema = new mongoose.Schema(
  {
    page_title: { type: String, required: true },
    page_slug: { type: String, required: true, unique: true },

    meta_title: String,
    meta_description: String,
    meta_keywords: String,
    meta_canonical: String,

    banner_image: String, // stored path
    banner_text: String,
  },
  { timestamps: true }
);

export default mongoose.model("HomeSeo", HomeSeoSchema);
