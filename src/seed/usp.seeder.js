import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import UspSection from "../models/UspSection.js";

dotenv.config();

const seedUsp = async () => {
  try {
    console.log("🚀 USP Seeder started");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Remove old USP (only one allowed)
    await UspSection.deleteMany();

    const fakeContent = `
      <h3>${faker.company.catchPhrase()}</h3>
      <ul>
        <li>${faker.company.buzzPhrase()}</li>
        <li>${faker.company.buzzPhrase()}</li>
        <li>${faker.company.buzzPhrase()}</li>
        <li>${faker.company.buzzPhrase()}</li>
      </ul>
      <p>${faker.lorem.paragraph()}</p>
    `;

    await UspSection.create({
      content: fakeContent,
    });

    console.log("✅ USP fake data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ USP seeding failed:", error);
    process.exit(1);
  }
};

seedUsp();
