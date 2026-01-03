import mongoose from "mongoose";

const advisoryCouncilSchema = new mongoose.Schema(
  {
    /* -------------------------
       MEMBER TYPE
       -------------------------
       ADVISORY_COUNCIL
       AFFILIATED_FACULTY_PRACTITIONERS_INNOVATION
    ------------------------- */
    type: {
      type: String,
      required: true,
      enum: [
        "ADVISORY_COUNCIL",
        "AFFILIATED_FACULTY_PRACTITIONERS_INNOVATION",
      ],
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    role_expertise: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    /* -------------------------
       SOFT DELETE SUPPORT
    ------------------------- */
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* 👇 FORCE COLLECTION NAME (UPDATED) */
export default mongoose.model(
  "Advisorycouncilcsr",       // model name (can be anything, recommended unique)
  advisoryCouncilSchema,
  "advisory-council-csr"      // ✅ new MongoDB collection name
);
