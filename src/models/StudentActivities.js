import mongoose from "mongoose";

const StudentActivitiesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("StudentActivities", StudentActivitiesSchema);
