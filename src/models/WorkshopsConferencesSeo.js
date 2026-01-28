import mongoose from "mongoose";

const workshopsConferencesSeoSchema = new mongoose.Schema(
  {
    page_title: {
      type: String,
      required: true,
      default: "Workshops & Conferences",
      immutable: true,
      unique: true,
    },

    page_slug: {
      type: String,
      required: true,
      default: "conferences-workshops",
      immutable: true,
    },

    meta_title: {
      type: String,
      
    },

    meta_description: {
      type: String,
    
    },

    meta_keywords: String,
    meta_canonical: String,

    banner_image: String,
    banner_text: String,
  },
  { timestamps: true }
);

/**
 * Model name: WorkshopsConferencesSeo
 * Collection name: workshopsconferencesseos
 */
const WorkshopsConferencesSeo =
  mongoose.models.WorkshopsConferencesSeo ||
  mongoose.model(
    "WorkshopsConferencesSeo",
    workshopsConferencesSeoSchema
  );

export default WorkshopsConferencesSeo;
