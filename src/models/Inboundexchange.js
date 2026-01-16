import mongoose from "mongoose";

const inboundExchangeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    content: {
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

// 👇 FORCE COLLECTION NAME
export default mongoose.model(
  "InboundExchange",
  inboundExchangeSchema,
  "inboundexchange"
);
