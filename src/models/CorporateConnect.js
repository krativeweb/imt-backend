import mongoose from "mongoose";

const CorporateConnectSchema = new mongoose.Schema(
  {
    tab_type: {
      type: String,
      required: true,
      enum: ["Panel Discussion", "Leadership Series", "Guest Lectures"],
    },

    academic_year: {
      type: String,
      required: true,
    },

    tab_content: {
      type: String,
      required: true,
    },

    is_deleted: {
      type: Boolean,
      default: false, // soft delete flag
    },
  },
  { timestamps: true }
);

export default mongoose.model("CorporateConnect", CorporateConnectSchema);
