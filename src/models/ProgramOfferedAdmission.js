import mongoose from "mongoose";

const programOfferedAdmissionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// 👇 MODEL + COLLECTION FOR PROGRAM OFFERED ADMISSION
export default mongoose.model(
  "ProgramOfferedAdmission",          // Model name
  programOfferedAdmissionSchema,
  "programoffered_admission"          // Collection name
);
