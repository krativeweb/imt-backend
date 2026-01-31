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

    meta_title: {
      type: String,
      default: "",
    },

    meta_description: {
      type: String,
      default: "",
    },

    meta_keywords: {
      type: String,
      default: "",
    },

    meta_canonical: {
      type: String,
      default: "",
    },

    banner_image: {
      type: String,
      default: "",
    },

    banner_text: {
      type: String,
      default: "",
    },

    // ✅ NEW: Email
    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    // ✅ NEW: Phone
    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // ✅ Privacy Policy main content
    content: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const PrivacyPolicy =
  mongoose.models.PrivacyPolicy ||
  mongoose.model("PrivacyPolicy", PrivacyPolicySchema);

export default PrivacyPolicy;
