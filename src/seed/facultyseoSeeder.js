import mongoose from "mongoose";
import dotenv from "dotenv";
import FacultyPageSEO from "../models/FacultyPageSEO.js";

dotenv.config();

const seedFacultySEO = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // ❌ remove old data (optional)
    await FacultyPageSEO.deleteMany();

    const fakeData = {
      page_title: "Faculty",
      page_slug: "faculty",
      meta_title: "Faculty at IMT Hyderabad",
      meta_description:
        "Meet the experienced and research-driven faculty members at IMT Hyderabad.",
      meta_keywords:
        "IMT Hyderabad faculty, management faculty, professors",
      meta_canonical: "https://www.imthyderabad.edu.in/faculty",
      banner_image: "/uploads/faculty/demo-banner.jpg", // placeholder
      banner_text: `
        <h1>Our Faculty</h1>
        <p>
          IMT Hyderabad faculty members bring together academic excellence,
          industry exposure, and research expertise to shape future leaders.
        </p>
      `,
    };

    await FacultyPageSEO.create(fakeData);

    console.log("✅ Faculty SEO fake data inserted successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seedFacultySEO();
