import mongoose from "mongoose";

const HomeAboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String, // store path only
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("HomeAbout", HomeAboutSchema);
