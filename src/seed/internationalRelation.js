import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import mongoose from "mongoose";
import MandatoryPage from "../models/MandatoryPage.js";

dotenv.config();

const irPages = [
  "Studying at IMT Hyderabad",
  "International Associations",
  "Faculty Exchange",
  "Student Exchange",
  "Step @ IMT DUBAI",
  "Global Immersion",
  "Photo Gallery",
  "News",
  "FAQs",
  "Point of Contact",
];

const fakeIRPages = irPages.map((title) => {
  const slug = title.toLowerCase().replace(/ & /g, "-and-").replace(/ /g, "-");

  return {
    page_title: title,
    page_slug: slug,
    page_parent: "International-Relations",
    meta_title: `${title} | IMT Hyderabad`,
    meta_description: `This is the ${title} page. Learn more about IMT Hyderabad.`,
    meta_keywords: `${title}, IMT Hyderabad, International Relations`,
    meta_canonical: `https://imt.ac.in/${slug}`,
    banner_image: "",
    banner_text: title,
    page_content: `<h1>${title}</h1><p>Content for ${title} page.</p>`,
  };
});

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await MandatoryPage.insertMany(fakeIRPages);
    console.log(
      "✔ International Relations pages inserted successfully (Old data preserved)"
    );

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
