import mongoose from "mongoose";
import dotenv from "dotenv";
import FacultyPagedetailsSEO from "../models/FacultyPagedetailsSEO.js";
// 👆 adjust path if needed

dotenv.config();

const facultySeoData = [
  {
    page_title: "Dr. John Doe - Professor of Management",
    page_slug: "dr-john-doe",
    meta_title: "Dr. John Doe | Faculty | IMT Hyderabad",
    meta_description:
      "Dr. John Doe is a Professor of Management at IMT Hyderabad with expertise in strategy and leadership.",
    meta_keywords: "Dr John Doe, IMT Faculty, Management Professor",
    meta_canonical: "https://imthyderabad.edu.in/faculty/dr-john-doe",
    banner_image: "/uploads/faculty/john-doe.jpg",
    banner_text: "<h1>Dr. John Doe</h1><p>Professor of Management</p>",
  },
];

const seedFacultySEO = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // ❌ Optional: clear existing data
    await FacultyPagedetailsSEO.deleteMany();
    console.log("🗑 Existing SEO data cleared");

    // ✅ Insert fresh data
    await FacultyPagedetailsSEO.insertMany(facultySeoData);
    console.log("🌱 Faculty SEO data seeded successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Seeder error:", error);
    process.exit(1);
  }
};

seedFacultySEO();
