import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ProgramOfferedAdmission from "../models/ProgramOfferedAdmission.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "program-offered-admission"
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
    const name = `program-admission-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

/* ===============================
   GET ALL (NON-DELETED)
================================ */
router.get("/", async (req, res) => {
  try {
    const programs = await ProgramOfferedAdmission.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json(programs);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   GET SINGLE
================================ */
router.get("/:id", async (req, res) => {
  try {
    const program = await ProgramOfferedAdmission.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program Offered Admission not found",
      });
    }

    res.json(program);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD PROGRAM
================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const program = await ProgramOfferedAdmission.create({
      title,
      description,
      image: `uploads/program-offered-admission/${req.file.filename}`,
    });

    res.status(201).json(program);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE PROGRAM
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const program = await ProgramOfferedAdmission.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program Offered Admission not found",
      });
    }

    if (req.body.title) program.title = req.body.title;
    if (req.body.description) program.description = req.body.description;

    if (req.file) {
      program.image = `uploads/program-offered-admission/${req.file.filename}`;
    }

    await program.save();

    res.json(program);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   SOFT DELETE
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const program = await ProgramOfferedAdmission.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program Offered Admission not found",
      });
    }

    program.isDeleted = true;
    program.deletedAt = new Date();
    await program.save();

    res.json({
      success: true,
      message: "Program Offered Admission deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
