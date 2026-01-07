import mongoose from "mongoose";

const CampusPlacementsSchema = new mongoose.Schema(
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
    final_placements: String,
    placements_procedure: String,
    placements_brochure: String,
    student_committees: String,
    contact_us: String,
  },
  { timestamps: true }
);

export default mongoose.model("CampusPlacements", CampusPlacementsSchema);
