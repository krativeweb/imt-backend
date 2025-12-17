import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import HomeSeo from "../models/HomeSeo.js";
import { connectDB } from "../config/db.js";

dotenv.config();

/* ---------------------------------
   SEED FUNCTION
--------------------------------- */
const seedHomeSeo = async () => {
  try {
    await connectDB();

    // OPTIONAL: clear existing data
    await HomeSeo.deleteMany();

    const fakeData = {
      page_title: "Home",
      page_slug: "/",
      meta_title: faker.company.catchPhrase(),
      meta_description: faker.lorem.sentence(20),
      meta_keywords: "MBA, Management, Business School",
      meta_canonical: "https://imt-example.com/",
      banner_text: `<h1>${faker.company.name()}</h1><p>${faker.lorem.paragraph()}</p>`,
      banner_image: "uploads/banner/sample-banner.jpg", // fake/static image
    };

    await HomeSeo.create(fakeData);

    console.log("✅ Home SEO fake data inserted");
    process.exit();
  } catch (error) {
    console.error("❌ Seeder error:", error);
    process.exit(1);
  }
};

seedHomeSeo();
