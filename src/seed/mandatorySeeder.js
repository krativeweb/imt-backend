import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import mongoose from "mongoose";
import MandatoryPage from "../models/MandatoryPage.js";

dotenv.config();

const pages = [
  "Mandatory Disclosure",
  "Committees",
  "Ombudsman",
  "Model Code Of Conduct",
  "Standards Of Scholarship",
  "Refund Policy",
  "Approvals & Accreditation",
  "Feedback Faculties",
  "Grievance Redressal",
  "MOM BOG",
  "Financial Statements",
  "Placement Data",
  "Tenders",
];

const fakePages = pages.map((title) => {
  const slug = title.toLowerCase().replace(/ & /g, "-and-").replace(/ /g, "-");

  return {
    page_title: title,
    page_slug: slug,
    page_parent: "Mandatory-Disclosure",
    meta_title: `${title} | IMT Hyderabad`,
    meta_description: `This is the ${title} page. Learn more about IMT Hyderabad.`,
    meta_keywords: `${title}, IMT Hyderabad`,
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

    await MandatoryPage.deleteMany();
    console.log("Old records removed");

    await MandatoryPage.insertMany(fakePages);
    console.log("13 Mandatory Page fake data inserted successfully ✔");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
