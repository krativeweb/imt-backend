import mongoose from "mongoose";

const CallToActionSchema = new mongoose.Schema(
  {
   
    cta_content: {
      type: String,
      required: true,
      // stores TinyMCE HTML content
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* 👇 Clear model & collection naming */
export default mongoose.model(
  "Newannoucement",
  CallToActionSchema,
  "new_annoucement"
);
