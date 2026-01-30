import mongoose from "mongoose";

const StudentLifeSchema = new mongoose.Schema(
  {
    page_title: {
      type: String,
      required: true,
      trim: true,
    },

    page_slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    meta_title: { type: String, default: "" },
    meta_description: { type: String, default: "" },
    meta_keywords: { type: String, default: "" },
    meta_canonical: { type: String, default: "" },

    banner_image: { type: String, default: "" },
    banner_text: { type: String, default: "" },

    student_life_content: { type: String, default: "" },

    student_life_images: { type: [String], default: [] },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/* ✅ USE Studentlife CONSISTENTLY */
export default mongoose.model(
  "Studentlife",        // ✅ KEEP THIS
  StudentLifeSchema,
  "student_life"
);
