import mongoose from "mongoose";

const InboundApplicationFormSchema = new mongoose.Schema(
  {
    content: {
      type: String, // HTML content from CmsEditor
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Inboundapplicationform",
  InboundApplicationFormSchema,
  "inboundapplicationform" // 👈 EXACT MongoDB collection name
);
