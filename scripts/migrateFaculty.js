import mysql from "mysql2/promise";
import mongoose from "mongoose";
import Faculty from "../src/models/Faculty.js";
import dotenv from "dotenv";

dotenv.config();

/* -----------------------------
   MYSQL CONNECTION
----------------------------- */
const mysqlConn = await mysql.createConnection({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: 3306,
});

const parseDate = (value) => {
  if (!value) return null;

  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};
/* -----------------------------
   MONGODB CONNECTION
----------------------------- */
await mongoose.connect(process.env.MONGO_URI);
console.log("✅ MongoDB connected");

/* -----------------------------
   MIGRATION
----------------------------- */
const migrateFaculty = async () => {
  const [rows] = await mysqlConn.execute(
    "SELECT * FROM imt_faculty_directory_details WHERE is_del = 0"
  );

  console.log(`Found ${rows.length} faculty records`);

  for (const row of rows) {
    const facultyDoc = {
      academic_title: row.prof_prefix,
      name: row.prof_name,
      slug: row.page_slug,
      designation: row.prof_designation,
      qualification: row.prof_qualification,
      functional_area: row.prof_functional_area,
      date_of_joining: parseDate(row.joining_date),
      email: row.prof_email,
      phone: row.prof_mobile,
      linkedin_url: row.prof_linkedin,
      google_scholar_url: row.prof_scholar_link,
      faculty_image: row.prof_image
        ? `uploads/faculty/faculty_images/${row.prof_image}`
        : null,

      qr_image: row.prof_qrcode
        ? `uploads/faculty/qr_images/${row.prof_qrcode}`
        : null,
      brief: row.prof_description,
      education: row.prof_education,
      teaching_research_interests: row.prof_teaching_interest,
      publications: row.prof_publications,
      awards_honors: row.prof_awards,
      other_professional_activities: row.prof_other_activity,
      isDeleted: row.is_del === "1",
    };

    // UPSERT (update if exists, else insert)
    await Faculty.findOneAndUpdate({ slug: facultyDoc.slug }, facultyDoc, {
      upsert: true,
      new: true,
    });
  }

  console.log("✅ Faculty migration completed");
  process.exit();
};

migrateFaculty();
