import mongoose from "mongoose";

const NewsletterSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },

    // 🔥 Soft delete field
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Newsletter", NewsletterSchema);
