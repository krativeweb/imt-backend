import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema(
  {
    academic_title: String,

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    designation: {
      type: String,
      required: true,
    },

    qualification: String,
    functional_area: String,
    date_of_joining: Date,
    email: {
      type: String,
      required: true,
    },
    phone: String,
    linkedin_url: String,
    google_scholar_url: String,

    faculty_image: {
      type: String,
      required: true,
    },

     meta_title: {
      type: String,
      trim: true,
      
    },

    meta_description: {
      type: String,
      trim: true,
    
    },

    meta_keywords: {
      type: String,
      trim: true,
    },

    meta_canonical: {
      type: String,
      trim: true,
    },

    qr_image: {
      type: String,
      required: true,
    },

    brief: String,
    education: String,
    teaching_research_interests: String,
    publications: String,
    awards_honors: String,
    other_professional_activities: String,
    isDeleted: {
  type: Boolean,
  default: false,
},
  },
  { timestamps: true }
);

export default mongoose.model("Faculty", FacultySchema);
