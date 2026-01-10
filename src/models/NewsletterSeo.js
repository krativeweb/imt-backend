import mongoose from "mongoose";

const NewsletterSeoSchema = new mongoose.Schema(
  {
    page_title: String,
    page_slug: String,

    meta_title: String,
    meta_description: String,
    meta_keywords: String,
    meta_canonical: String,

    banner_image: String,
    banner_text: String,
  },
  { timestamps: true }
);

export default mongoose.model("newsletter-seo", NewsletterSeoSchema);
