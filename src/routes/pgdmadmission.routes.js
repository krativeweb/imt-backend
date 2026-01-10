import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import PgdmFinance from "../models/PgdmAdmission.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   UPLOAD DIRECTORIES
--------------------------------------------------- */
const uploadBaseDir = path.join(__dirname, "../uploads/pgdm-admission");

const bannerDir = path.join(uploadBaseDir, "banner");
const accreditationDir = path.join(uploadBaseDir, "accreditation");
const campusDir = path.join(uploadBaseDir, "campus");

// Ensure folders exist
[bannerDir, accreditationDir, campusDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* ---------------------------------------------------
   STATIC FILE SERVING
--------------------------------------------------- */
router.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* ---------------------------------------------------
   MULTER CONFIG
--------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "banner_image") {
      cb(null, bannerDir);
    } else if (file.fieldname === "accreditation_images") {
      cb(null, accreditationDir);
    } else if (file.fieldname === "life_imt_Hyderabad_images") {
      cb(null, campusDir);
    } else {
      cb(null, uploadBaseDir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

/* ---------------------------------------------------
   GET (ADMIN – ARRAY)
--------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const data = await PgdmFinance.find({
      page_slug: "pgdm-admission",
    }).lean();

    res.json(data || []);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ---------------------------------------------------
   GET BY SLUG (FRONTEND – OBJECT)
--------------------------------------------------- */
router.get("/slug/:slug", async (req, res) => {
  try {
    const data = await PgdmFinance.findOne({
      page_slug: req.params.slug,
    }).lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "PGDM Admission data not found",
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ---------------------------------------------------
   UPDATE PGDM ADMISSION (FULL)
--------------------------------------------------- */
router.put(
  "/:id",
  upload.fields([
    { name: "banner_image", maxCount: 1 },
    { name: "accreditation_images", maxCount: 20 },
    { name: "life_imt_Hyderabad_images", maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const body = req.body;
      const files = req.files;

      /* ---------------- TEXT / SEO ---------------- */
      const updateData = {
        page_title: body.page_title,
        page_slug: body.page_slug,

        meta_title: body.meta_title,
        meta_description: body.meta_description,
        meta_keywords: body.meta_keywords,
        meta_canonical: body.meta_canonical,

        banner_text: body.banner_text,

        features_section: body.features_section,
        advantage_of_imt_hyderabad: body.advantage_of_imt_hyderabad,
        advantage_of_imt_blocks: body.advantage_of_imt_blocks,
        impeccable_placement: body.impeccable_placement,
        elligibility: body.elligibility,
        remember_important_dates: body.remember_important_dates,
        admission_process: body.admission_process,
        admission_information: body.admission_information,
        program_highlights: body.program_highlights,
        life_imt_Hyderabad_campus: body.life_imt_Hyderabad_campus,
      };

      /* ---------------- BANNER IMAGE ---------------- */
      if (files?.banner_image?.length) {
        updateData.banner_image =
          `/api/pgdm-admission/uploads/pgdm-admission/banner/${files.banner_image[0].filename}`;
      }

      /* ---------------- ACCREDITATION IMAGES ---------------- */
      const existingAccreditation =
        body["existing_accreditation_images[]"]
          ? [].concat(body["existing_accreditation_images[]"])
          : [];

      const newAccreditation =
        files?.accreditation_images?.map(
          (f) =>
            `/api/pgdm-admission/uploads/pgdm-admission/accreditation/${f.filename}`
        ) || [];

      updateData.accreditation_images = [
        ...existingAccreditation,
        ...newAccreditation,
      ];

      /* ---------------- CAMPUS IMAGES ---------------- */
      const existingCampus =
        body["existing_campus_images[]"]
          ? [].concat(body["existing_campus_images[]"])
          : [];

      const newCampus =
        files?.life_imt_Hyderabad_images?.map(
          (f) =>
            `/api/pgdm-admission/uploads/pgdm-admission/campus/${f.filename}`
        ) || [];

      updateData.life_imt_Hyderabad_images = [
        ...existingCampus,
        ...newCampus,
      ];

      const updated = await PgdmFinance.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "PGDM Admission record not found",
        });
      }

      res.json({
        success: true,
        message: "PGDM Admission updated successfully",
        data: updated,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

export default router;
