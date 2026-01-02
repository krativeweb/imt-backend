import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Workshop from "../models/WorkshopsDetails.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "workshops"
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
    const name = `workshop-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

/* ===============================
   GET ALL WORKSHOPS (NON-DELETED)
================================ */
router.get("/", async (req, res) => {
  try {
    const workshops = await Workshop.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: workshops });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   GET SINGLE WORKSHOP
================================ */
router.get("/:id", async (req, res) => {
  try {
    const workshop = await Workshop.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: "Workshop not found",
      });
    }

    res.json({ success: true, data: workshop });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD WORKSHOP
================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, company, program_director } = req.body;

    if (!title || !company || !program_director) {
      return res.status(400).json({
        success: false,
        message: "Title, company and program director are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const workshop = await Workshop.create({
      title,
      company,
      program_director,
      image: `uploads/workshops/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      data: workshop,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE WORKSHOP
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const workshop = await Workshop.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: "Workshop not found",
      });
    }

    if (req.body.title) workshop.title = req.body.title;
    if (req.body.company) workshop.company = req.body.company;
    if (req.body.program_director)
      workshop.program_director = req.body.program_director;

    if (req.file) {
      workshop.image = `uploads/workshops/${req.file.filename}`;
    }

    await workshop.save();

    res.json({
      success: true,
      data: workshop,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   SOFT DELETE WORKSHOP
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const workshop = await Workshop.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: "Workshop not found",
      });
    }

    workshop.isDeleted = true;
    workshop.deletedAt = new Date();
    await workshop.save();

    res.json({
      success: true,
      message: "Workshop deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
