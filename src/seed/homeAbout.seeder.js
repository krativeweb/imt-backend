import mongoose from "mongoose";
import dotenv from "dotenv";
import HomeAbout from "../models/HomeAbout.js";

dotenv.config();

/* ---------------------------------
   DB CONNECT
--------------------------------- */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
};

/* ---------------------------------
   SEED DATA
--------------------------------- */
const seedHomeAbout = async () => {
  try {
    await HomeAbout.deleteMany(); // ⚠️ clears old data

    await HomeAbout.create({
      title: "About Us",
      description: `
        <p>
          IMT Hyderabad is committed to academic excellence, innovation,
          and leadership development. We aim to nurture future leaders
          with strong ethical values and global perspectives.
        </p>
        <p>
          Our institution combines rigorous academics, industry exposure,
          and research-driven learning to prepare students for real-world
          challenges.
        </p>
      `,
      image: "/uploads/home/about/about-default.jpg",
    });

    console.log("✅ Home About seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed", err);
    process.exit(1);
  }
};

/* ---------------------------------
   RUN
--------------------------------- */
await connectDB();
await seedHomeAbout();
