import dotenv from "dotenv";
dotenv.config(); // ✅ LOAD .env HERE (DO NOT TOUCH db.js)

import mongoose from "mongoose";
import LrcPage from "../models/LrcPage.js";
import { connectDB } from "../config/db.js";

const seedLrcPage = async () => {
  try {
    await connectDB();

    // Remove existing LRC page
    await LrcPage.deleteMany({ page_slug: "lrc" });

    const lrcPage = new LrcPage({
      page_title: "Learning Resource Centre",
      page_slug: "lrc",

      meta_title: "Learning Resource Centre | IMT Hyderabad",
      meta_description:
        "The Learning Resource Centre at IMT Hyderabad provides access to books, journals, databases, and digital resources.",
      meta_keywords:
        "LRC IMT Hyderabad, library resources, academic journals, e-books",
      meta_canonical: "https://imthyderabad.edu.in/lrc",

      banner_image: "uploads/banner/lrc-banner-demo.jpg",

      about_lrc: `
        <p>
          The Learning Resource Centre (LRC) at IMT Hyderabad serves as the
          academic heart of the institution. It supports teaching, learning,
          and research activities by providing access to a wide range of
          information resources.
        </p>
        <p>
          The LRC houses an extensive collection of books, national and
          international journals, case studies, and digital databases.
        </p>
      `,

      resources: `
        <ul>
          <li>EBSCO Business Source Complete</li>
          <li>JSTOR Academic Journals</li>
          <li>Emerald Insight</li>
          <li>ProQuest Databases</li>
          <li>Delnet Resource Sharing</li>
        </ul>
        <p>
          Students and faculty can access both physical and electronic
          resources through the LRC portal.
        </p>
      `,
    });

    await lrcPage.save();

    console.log("✅ LRC Page seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder error:", error.message);
    process.exit(1);
  }
};

seedLrcPage();
