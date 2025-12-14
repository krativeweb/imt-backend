import mongoose from "mongoose";

const PlacementSchema = new mongoose.Schema(
  {
    page_title: { type: String, required: true },
    page_slug: { type: String, required: true, unique: true },

    meta_title: String,
    meta_description: String,
    meta_keywords: String,
    meta_canonical: String,

    banner_image: String,
    banner_text: String,
    ranking_content: String,

    director_image: String,
    director_message: String,

    corporate_image: String,
    corporate_message: String,

    sector_stat_image: String,

    gallery_images: [String],
  },
  { timestamps: true }
);

const Placement = mongoose.model("Placement", PlacementSchema);

export default Placement;
