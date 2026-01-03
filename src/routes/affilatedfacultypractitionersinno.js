import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import AffiliatedFacultyPractitionersInnovation from "../models/Affilatedfacultypractitionersinno.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "affiliated-faculty-practitioners-innovation"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ===============================
   MULTER CONFIG
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `affiliated-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

/* ===============================
   GET ALL (NON-DELETED)
   GET /api/affiliated-faculty-practitioners-innovation
================================ */
router.get("/", async (req, res) => {
  try {
    const members =
      await AffiliatedFacultyPractitionersInnovation.find({
        isDeleted: false,
      }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: members,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   GET SINGLE
   GET /api/affiliated-faculty-practitioners-innovation/:id
================================ */
router.get("/:id", async (req, res) => {
  try {
    const member =
      await AffiliatedFacultyPractitionersInnovation.findOne({
        _id: req.params.id,
        isDeleted: false,
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message:
          "Affiliated Faculty & Practitioner not found",
      });
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD MEMBER
   POST /api/affiliated-faculty-practitioners-innovation
================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, designation, role_expertise } = req.body;

    if (!name || !designation || !role_expertise) {
      return res.status(400).json({
        success: false,
        message:
          "Name, designation and role/expertise are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const member =
      await AffiliatedFacultyPractitionersInnovation.create({
        name,
        designation,
        role_expertise,
        image: `uploads/affiliated-faculty-practitioners-innovation/${req.file.filename}`,
      });

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE MEMBER
   PUT /api/affiliated-faculty-practitioners-innovation/:id
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const member =
      await AffiliatedFacultyPractitionersInnovation.findOne({
        _id: req.params.id,
        isDeleted: false,
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message:
          "Affiliated Faculty & Practitioner not found",
      });
    }

    if (req.body.name) member.name = req.body.name;
    if (req.body.designation)
      member.designation = req.body.designation;
    if (req.body.role_expertise)
      member.role_expertise = req.body.role_expertise;

    if (req.file) {
      member.image = `uploads/affiliated-faculty-practitioners-innovation/${req.file.filename}`;
    }

    await member.save();

    res.json({
      success: true,
      data: member,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   SOFT DELETE
   DELETE /api/affiliated-faculty-practitioners-innovation/:id
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const member =
      await AffiliatedFacultyPractitionersInnovation.findOne({
        _id: req.params.id,
        isDeleted: false,
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message:
          "Affiliated Faculty & Practitioner not found",
      });
    }

    member.isDeleted = true;
    member.deletedAt = new Date();
    await member.save();

    res.json({
      success: true,
      message:
        "Affiliated Faculty & Practitioner deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
