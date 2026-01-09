import mongoose from "mongoose";

const distinguishedClientSchema = new mongoose.Schema(
  {
    title: {
      type: String,
     
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    /* 🔹 SOFT DELETE */
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

// 👇 FORCE COLLECTION NAME
export default mongoose.model(
  "DistinguishedClients",      // Model name
  distinguishedClientSchema,
  "distinguished_clients"      // Collection name
);
