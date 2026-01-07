import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import StudentsOnRoll from "../models/StudentonRole.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "students-on-roll"
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
    const name = `student-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

/* ===============================
   GET ALL (NON-DELETED)
   GET /api/students-on-roll
================================ */
router.get("/", async (req, res) => {
  try {
    const students = await StudentsOnRoll.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: students,
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
   GET /api/students-on-roll/:id
================================ */
router.get("/:id", async (req, res) => {
  try {
    const student = await StudentsOnRoll.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD STUDENT
   POST /api/students-on-roll
================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      joining_year,
      specialization,
      qualification,
      research_interests,
      email,
      bio,
    } = req.body;

    if (
      !name ||
      !joining_year ||
      !specialization ||
      !qualification ||
      !research_interests ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const student = await StudentsOnRoll.create({
      name,
      joining_year,
      specialization,
      qualification,
      research_interests,
      email,
      bio,
      image: `uploads/students-on-roll/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE STUDENT
   PUT /api/students-on-roll/:id
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const student = await StudentsOnRoll.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    /* UPDATE FIELDS */
    if (req.body.name) student.name = req.body.name;
    if (req.body.joining_year)
      student.joining_year = req.body.joining_year;
    if (req.body.specialization)
      student.specialization = req.body.specialization;
    if (req.body.qualification)
      student.qualification = req.body.qualification;
    if (req.body.research_interests)
      student.research_interests = req.body.research_interests;
    if (req.body.email) student.email = req.body.email;
    if (req.body.bio !== undefined) student.bio = req.body.bio;

    if (req.file) {
      student.image = `uploads/students-on-roll/${req.file.filename}`;
    }

    await student.save();

    res.json({
      success: true,
      data: student,
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
   DELETE /api/students-on-roll/:id
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const student = await StudentsOnRoll.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    student.isDeleted = true;
    student.deletedAt = new Date();
    await student.save();

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
