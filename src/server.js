import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mandatoryDisclosureRoutes from "./routes/mandatoryDisclosureRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import studentActivitiesRoutes from "./routes/studentActivities.js";
import photoGalleryRoutes from "./routes/photoGallery.js";
import newsRoutes from "./routes/news.js";
import faqRoutes from "./routes/faqRoutes.js";
import placementRoutes from "./routes/placementRoutes.js";
import facultypageSeoRoutes from "./routes/facultypageSeo.routes.js";
import facultyRoutes from "./routes/faculty.routes.js";
import lrcRoutes from "./routes/lrc.routes.js";
import lrcFaqRoutes from "./routes/lrcFaq.routes.js";
import awardsRecognitionSeoRoutes from "./routes/awardsRecognitionSeo.routes.js";
import awardsRoutes from "./routes/awards.js";
import facultyAwardsRoutes from "./routes/facultyAwards.js";
import homeSeoRoutes from "./routes/homeSeo.routes.js";
import homeAboutRoutes from "./routes/homeAbout.routes.js";
import uspRoutes from "./routes/uspSection.routes.js";
import researchInFocus from "./routes/researchInFocus.routes.js";
import programOffered from "./routes/programOffered.routes.js";
import happenings from "./routes/Happenings.routes.js";
import events from "./routes/events.routes.js";
import announcement from "./routes/announcements.routes.js";
import internationalasssociarion from "./routes/internationalAssociation.routes.js";
import placementalliance from "./routes/placementAlliances.routes.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS FIRST — this sets headers on ALL responses (including /uploads)
const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server / Postman / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Serve static files WITH proper CORS already applied from above
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Optional: Extra insurance for images (not strictly needed now)
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// Cookie parser
app.use(cookieParser());

// Rate limiting (only on /api)
app.set("trust proxy", 1);
app.use(
  "/api",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 500,
  })
);

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.get("/", (req, res) => {
  res.json({ message: "Secure Auth API with jose is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mandatory", mandatoryDisclosureRoutes);
app.use("/api/student-activities", studentActivitiesRoutes);
app.use("/api/photo-gallery", photoGalleryRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/placement", placementRoutes);
app.use("/api/faculty-seo", facultypageSeoRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/lrc-page", lrcRoutes);
app.use("/api/lrc-faq", lrcFaqRoutes);
app.use("/api/awards-recognition-seo", awardsRecognitionSeoRoutes);
app.use("/api/awards", awardsRoutes);
app.use("/api/faculty-awards", facultyAwardsRoutes);
app.use("/api/home-seo", homeSeoRoutes);
app.use("/api/home-about", homeAboutRoutes);
app.use("/api/usp", uspRoutes);
app.use("/api/research-infocus", researchInFocus);
app.use("/api/program-offered", programOffered);
app.use("/api/happenings", happenings);
app.use("/api/events", events);
app.use("/api/announcements", announcement);
app.use("/api/international-association", internationalasssociarion);
app.use("/api/placement-alliances", placementalliance);
app.use("/api/faculty-details-seo", facultydetailsseo);
// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
