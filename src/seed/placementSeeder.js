import mongoose from "mongoose";
import dotenv from "dotenv";
import Placement from "../models/Placement.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");

    const fake = {
      page_title: "Placement Overview",
      page_slug: "placement-overview",

      meta_title: "Placement | IMT Hyderabad",
      meta_description: "Placement details of IMT Hyderabad",
      meta_keywords: "placement, IMT Hyderabad",
      meta_canonical: "https://imt.ac.in/placement-overview",

      banner_image: "",
      banner_text: "<h1>Placement Overview</h1>",
      ranking_content: "<p>Ranking content goes here</p>",

      director_image: "",
      director_message: "<p>Director message content</p>",

      corporate_image: "",
      corporate_message: "<p>Corporate Relations message content</p>",

      sector_stat_image: "",
      gallery_images: [],
    };

    await Placement.deleteMany();
    const created = await Placement.create(fake);

    console.log("Placement Seeded:", created._id);
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seed();
