import mongoose from "mongoose";

const CorporateConnectSeoSchema = new mongoose.Schema(
  {
    page_title: { type: String },
    page_slug: { type: String },
    meta_title: { type: String },
    meta_description: { type: String },
    meta_keywords: { type: String },
    meta_canonical: { type: String },

    banner_image: { type: String }, // stored file path
    banner_text: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("CorporateConnectSeo", CorporateConnectSeoSchema);
