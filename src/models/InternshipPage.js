import mongoose from "mongoose";

const InternshipPageSchema = new mongoose.Schema(
  {
    page_title: String,
    page_slug: String,

    meta_title: String,
    meta_description: String,
    meta_keywords: String,
    meta_canonical: String,

    banner_image: String,
    banner_text: String,

    head_cro_message: String,

    internship_program: String,
    internship_procedure: String,
    student_committees: String,
    recruiters_guide: String,
    internship_reports: String,
    contact_us: String,
  },
  { timestamps: true }
);

const InternshipPage = mongoose.model("InternshipPage", InternshipPageSchema);

export default InternshipPage;
