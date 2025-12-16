import mongoose from "mongoose";
import dotenv from "dotenv";
import AwardsRecognitionSeo from "../models/AwardsRecognitionSeo.js";

dotenv.config();

/* ----------------------------------------
   MONGODB CONNECTION
---------------------------------------- */
const MONGO_URI = process.env.MONGO_URI;

const seedAwardsRecognitionSeo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    /* ----------------------------------------
       CHECK IF DATA ALREADY EXISTS
    ---------------------------------------- */
    const exists = await AwardsRecognitionSeo.findOne({
      page_slug: "awards-and-recognition",
    });

    if (exists) {
      console.log("⚠️ Awards & Recognition SEO already exists");
      process.exit();
    }

    /* ----------------------------------------
       INSERT FAKE DATA
    ---------------------------------------- */
    await AwardsRecognitionSeo.create({
      page_title: "Awards & Recognition",
      page_slug: "awards-and-recognition",

      meta_title: "Awards & Recognition | IMT Hyderabad",
      meta_description:
        "Explore awards and recognitions received by IMT Hyderabad for academic excellence, innovation, and leadership.",
      meta_keywords:
        "IMT Hyderabad awards, recognitions, achievements, institute awards",
      meta_canonical: "https://www.imthyderabad.edu.in/awards-and-recognition",

      banner_image: "uploads/banner/awards-banner.webp",
      banner_text: `
        <h1>Awards & Recognition</h1>
        <p>
          IMT Hyderabad has consistently received national and international
          recognition for excellence in management education, innovation,
          research, and industry engagement.
        </p>
      `,
    });

    console.log("🎉 Awards & Recognition SEO seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeder failed:", error);
    process.exit(1);
  }
};

seedAwardsRecognitionSeo();
