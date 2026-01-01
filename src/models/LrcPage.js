import mongoose from "mongoose";

const LrcPageSchema = new mongoose.Schema(
  {
    page_title: { type: String, required: true },
    page_slug: { type: String, required: true, unique: true },

    meta_title: String,
    meta_description: String,
    meta_keywords: String,
    meta_canonical: String,

    banner_image: String,
    banner_text: String,  

    about_lrc: String,
    resources: String,
  },
  { timestamps: true }
);

export default mongoose.model("LrcPage", LrcPageSchema);
