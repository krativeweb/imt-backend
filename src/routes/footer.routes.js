import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Footer from "../models/Footer.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   UPLOAD DIRECTORIES
--------------------------------------------------- */
const uploadBaseDir = path.join(__dirname, "../uploads/footer");
const accreditationDir = path.join(uploadBaseDir, "accreditations");
const memberDir = path.join(uploadBaseDir, "members");

[accreditationDir, memberDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* ---------------------------------------------------
   SERVE UPLOADS
--------------------------------------------------- */
router.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* ---------------------------------------------------
   MULTER CONFIG (MULTIPLE FIELDS)
--------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "accreditations") {
      cb(null, accreditationDir);
    } else if (file.fieldname === "members") {
      cb(null, memberDir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

/* ===================================================
   GET FOOTER (ADMIN / FRONTEND)
=================================================== */
router.get("/", async (req, res) => {
  try {
    const footer = await Footer.findOne({ isDeleted: false });
    res.status(200).json(footer || null);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===================================================
   CREATE FOOTER (ONE TIME ONLY)
=================================================== */
router.post("/", async (req, res) => {
  try {
    const exists = await Footer.findOne({ isDeleted: false });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Footer already exists",
      });
    }

    const footer = await Footer.create({});
    res.status(201).json({ success: true, data: footer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===================================================
   UPDATE FOOTER
=================================================== */
router.put(
  "/:id",
  upload.fields([
    { name: "accreditations", maxCount: 20 },
    { name: "members", maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const footer = await Footer.findById(req.params.id);
      if (!footer) {
        return res.status(404).json({
          success: false,
          message: "Footer not found",
        });
      }

      /* ---------- BASIC FIELDS ---------- */
      footer.address = req.body.address || "";
      footer.email = req.body.email || "";
      footer.phone = req.body.phone || "";

      footer.facebook_url = req.body.facebook_url || "";
      footer.linkedin_url = req.body.linkedin_url || "";
      footer.instagram_url = req.body.instagram_url || "";
      footer.youtube_url = req.body.youtube_url || "";

      footer.copyright_text = req.body.copyright_text || "";

      /* ---------- EXISTING ACCREDITATIONS ---------- */
      if (req.body["existing_accreditations[]"]) {
        footer.accreditations = Array.isArray(
          req.body["existing_accreditations[]"]
        )
          ? req.body["existing_accreditations[]"]
          : [req.body["existing_accreditations[]"]];
      } else {
        footer.accreditations = [];
      }

      /* ---------- NEW ACCREDITATIONS ---------- */
      if (req.files?.accreditations) {
        req.files.accreditations.forEach((file) => {
          footer.accreditations.push(
            `/api/footer/uploads/footer/accreditations/${file.filename}`
          );
        });
      }

      /* ---------- EXISTING MEMBERS ---------- */
      if (req.body["existing_members[]"]) {
        footer.members = Array.isArray(req.body["existing_members[]"])
          ? req.body["existing_members[]"]
          : [req.body["existing_members[]"]];
      } else {
        footer.members = [];
      }

      /* ---------- NEW MEMBERS ---------- */
      if (req.files?.members) {
        req.files.members.forEach((file) => {
          footer.members.push(
            `/api/footer/uploads/footer/members/${file.filename}`
          );
        });
      }

      await footer.save();

      res.status(200).json({
        success: true,
        message: "Footer updated successfully",
        data: footer,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
