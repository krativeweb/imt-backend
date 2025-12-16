import mongoose from "mongoose";

const facultyAwardSchema = new mongoose.Schema(
  {
    image: {
      type: String, // uploads/faculty-awards/filename.jpg
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    // SOFT DELETE
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

export default mongoose.model("FacultyAward", facultyAwardSchema);
