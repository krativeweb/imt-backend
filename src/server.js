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
import facultydetailsseo from "./routes/facultypagedetailsSeo.routes.js";
import newadmissions from "./routes/newannoucement.routes.js";
import homeconnect from "./routes/homeconnect.routes.js";
import imtassociationGalleryRoutes from "./routes/InternationalAssociationGallery.js";
import workshopseo from "./routes/workshopsConferencesSeo.routes.js";
import workshopdetails from "./routes/workshopsDetails.routes.js";
import conferencdetails from "./routes/conferenceDetails.routes.js";
import researchpublication from "./routes/researchpublications.routes.js";
import sponsorresearch from "./routes/sponsoredResearchAdvisoryServices.routes.js";
import centredigital from "./routes/centredigitaltransformation.routes.js";
import advisorycouncil from "./routes/advisoryCouncil.routes.js";
import centresustainability from "./routes/centresustainabilitycsr.routes.js";
import innovationlab from "./routes/innovationlab.routes.js";
import affilatedfacpracinno from "./routes/affilatedfacultypractitionersinno.js";
import advisorycouncilcsr from "./routes/advisorycouncilcsr.js";
import researcharchiveseo from "./routes/researchArchiveseo.routes.js";
import researchjournalpulication from "./routes/researchJournalpublication.routes.js";
import researchcasepublication from "./routes/researchCasespublication.routes.js";
import researchconferenceprocess from "./routes/researchConferenceproceeding.routes.js"
import researcharticlenews from "./routes/researchnewsarticle.routes.js";
import researchbooks from "./routes/researchbooks.routes.js";
import researchmagazines from "./routes/researchmagazines.routes.js";
import aboutpgdm from "./routes/aboutpgdm.routes.js";
import pgdmgeneral from "./routes/pgdmgeneral.routes.js";
import pgdmfinance from "./routes/pgdmfinance.routes.js";
import learnaboutprogram from "./routes/learnaboutProgram.routes.js";
import pgdmmarketing from "./routes/pgdmmarketing.routes.js";
import pgdmkscm from "./routes/pgdmlscm.routes.js";
import fellowprograminmngment from "./routes/fellowprograminmanagement.routes.js";
import studentsonroll from "./routes/studentonrole.js";
import exclusiveeducation from "./routes/executiveedication.routes.js";
import distinguishedclients from "./routes/distinguishedclients.routes.js";
import campusPlacementsRoutes from "./routes/CampusPlacements.js";
import internshipPageRoutes from "./routes/internshipPage.routes.js";
import fellowprograminmngmenttwo from "./routes/fellowprograminmanagementtwo.routes.js";
import corporateConnectSeoRoutes from "./routes/corporateConnectSeo.routes.js";
import corporateConnectRoutes from "./routes/corporateConnect.routes.js";
import pgdmadmission from "./routes/pgdmadmission.routes.js";
import studenttutorials from "./routes/studenttutorials.routes.js";
import newsletterRoutes from "./routes/newsletter.routes.js";
import newsletterSeoRoutes from "./routes/newsletterSeo.routes.js";
import programofferedadmission from "./routes/programOfferedAdmission.routes.js";
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
app.use("/api/newannoucement", newadmissions);
app.use("/api/home-connect", homeconnect);
app.use("/api/imt-association-gallery", imtassociationGalleryRoutes);
app.use("/api/workshops-conferences-seo", workshopseo);
app.use("/api/workshops", workshopdetails);
app.use("/api/conferences", conferencdetails);
app.use("/api/research-publication", researchpublication);
app.use("/api/sponsored-research", sponsorresearch);
app.use("/api/centre-digital-transformation", centredigital);
app.use("/api/advisory-council", advisorycouncil);
app.use("/api/centre-sustainability-csr", centresustainability);
app.use("/api/innovation-lab", innovationlab);
app.use("/api/affiliated-faculty-practitioners-innovation", affilatedfacpracinno);
app.use("/api/advisory-council-csr", advisorycouncilcsr);
app.use("/api/research-archive-seo", researcharchiveseo);
app.use("/api/research-journal-publication", researchjournalpulication);
app.use("/api/research-cases-publication", researchcasepublication);
app.use("/api/research-conference-proceeding", researchconferenceprocess);
app.use("/api/research-news-article", researcharticlenews);
app.use("/api/research-books", researchbooks);
app.use("/api/research-magazines", researchmagazines);
app.use("/api/about-pgdm", aboutpgdm);
app.use("/api/pgdm-general", pgdmgeneral);
app.use("/api/pgdm-finance", pgdmfinance);
app.use("/api/learn-about-program", learnaboutprogram);
app.use("/api/pgdm-marketing", pgdmmarketing);
app.use("/api/pgdm-logistics-supply-chain", pgdmkscm);
app.use("/api/fellowprogram-in-management", fellowprograminmngment);
app.use("/api/students-on-roll", studentsonroll);
app.use("/api/executive-education", exclusiveeducation);
app.use("/api/distinguished-clients", distinguishedclients);
app.use("/api/campus-placements", campusPlacementsRoutes);
app.use("/api/internship-page", internshipPageRoutes);
app.use("/api/fellow-program-management", fellowprograminmngmenttwo);
app.use("/api/corporate-connect-seo", corporateConnectSeoRoutes);
app.use("/api/corporate-connect", corporateConnectRoutes);
app.use("/api/pgdm-admission", pgdmadmission);
app.use("/api/student-tutorials", studenttutorials);
app.use("/api/newsletters", newsletterRoutes);
app.use("/api/newsletter-seo", newsletterSeoRoutes);
app.use("/api/program-offered-admission", programofferedadmission);

// Error handlers  
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
