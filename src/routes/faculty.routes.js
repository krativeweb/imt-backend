import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Faculty from "../models/Faculty.js";

const router = express.Router();

/* ----------------------------------------------------
   HELPERS
---------------------------------------------------- */

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/* ----------------------------------------------------
   UPLOAD DIRS
---------------------------------------------------- */

const baseDir = path.join(process.cwd(), "src", "uploads", "faculty");
const facultyImgDir = path.join(baseDir, "faculty_images");
const qrImgDir = path.join(baseDir, "qr_images");

[facultyImgDir, qrImgDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* ----------------------------------------------------
   MULTER CONFIG
---------------------------------------------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "faculty_image") cb(null, facultyImgDir);
    if (file.fieldname === "qr_image") cb(null, qrImgDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

/* ====================================================
   CREATE FACULTY
==================================================== */

router.post(
  "/",
  upload.fields([
    { name: "faculty_image", maxCount: 1 },
    { name: "qr_image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const slug = slugify(req.body.name);

      const exists = await Faculty.findOne({
        slug,
        isDeleted: false,
      });

      if (exists)
        return res.status(400).json({ message: "Faculty already exists" });

      const faculty = new Faculty({
        ...req.body,
        slug,
        faculty_image: `uploads/faculty/faculty_images/${req.files.faculty_image[0].filename}`,
        qr_image: `uploads/faculty/qr_images/${req.files.qr_image[0].filename}`,
      });

      await faculty.save();

      res.status(201).json({ message: "Faculty created", data: faculty });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ====================================================
   GET ALL FACULTY (HIDE DELETED)
==================================================== */

router.get("/", async (req, res) => {
  try {
    const data = await Faculty.find({ isDeleted: false }).sort({ name: 1 }); // A → Z

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ====================================================
   GET FACULTY BY SLUG (HIDE DELETED)
==================================================== */

router.get("/slug/:slug", async (req, res) => {
  const faculty = await Faculty.findOne({
    slug: req.params.slug,
    isDeleted: false,
  });

  if (!faculty) return res.status(404).json({ message: "Not found" });

  res.json(faculty);
});

/* ====================================================
   UPDATE FACULTY (BLOCK DELETED)
==================================================== */

router.put(
  "/:id",
  upload.fields([
    { name: "faculty_image", maxCount: 1 },
    { name: "qr_image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const faculty = await Faculty.findById(req.params.id);

      if (!faculty || faculty.isDeleted)
        return res.status(404).json({ message: "Not found" });

      if (req.body.name && req.body.name !== faculty.name) {
        faculty.slug = slugify(req.body.name);
      }

      if (req.files?.faculty_image) {
        faculty.faculty_image = `uploads/faculty/faculty_images/${req.files.faculty_image[0].filename}`;
      }

      if (req.files?.qr_image) {
        faculty.qr_image = `uploads/faculty/qr_images/${req.files.qr_image[0].filename}`;
      }

      Object.assign(faculty, req.body);
      await faculty.save();

      res.json({ message: "Faculty updated", data: faculty });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ====================================================
   SOFT DELETE FACULTY (ONLY isDeleted)
==================================================== */

router.delete("/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty || faculty.isDeleted)
      return res.status(404).json({ message: "Not found" });

    faculty.isDeleted = true;
    await faculty.save();

    res.json({ message: "Faculty deleted (soft)" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
