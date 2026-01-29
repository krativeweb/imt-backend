import mongoose from "mongoose";

const PrivacyPolicySchema = new mongoose.Schema(
  {
    page_title: {
      type: String,
      required: true,
    },

    page_slug: {
      type: String,
      required: true,
      unique: true,
    },

    meta_title: String,
    meta_description: String,
    meta_keywords: String,
    meta_canonical: String,

    banner_image: String,
    banner_text: String,

    // ✅ Privacy Policy main content
    content: String,
  },
  { timestamps: true }
);

const PrivacyPolicy =
  mongoose.models.PrivacyPolicy ||
  mongoose.model("PrivacyPolicy", PrivacyPolicySchema);

export default PrivacyPolicy;
