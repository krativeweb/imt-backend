import mongoose from "mongoose";

const awardsRecognitionSeoSchema = new mongoose.Schema(
  {
    page_title: {
      type: String,
      required: true,
      unique: true, // only one document for this page
    },
    page_slug: {
      type: String,
      required: true,
    },

    meta_title: String,
    meta_description: String,
    meta_keywords: String,
    meta_canonical: String,

    banner_image: String, // uploads/banner/filename.webp
    banner_text: String,
  },
  { timestamps: true }
);

const AwardsRecognitionSeo = mongoose.model(
  "awards-and-recognition-seo",
  awardsRecognitionSeoSchema
);

export default AwardsRecognitionSeo;
