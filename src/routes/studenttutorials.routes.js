import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import StudentTutorial from "../models/StudentTutorials.js";

const router = express.Router();

/* ---------------------------------------------------
   __DIRNAME FIX (ESM)
--------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------------------------------------------
   UPLOAD DIRECTORY
   src/uploads/student-tutorials/
--------------------------------------------------- */
const uploadBaseDir = path.join(
  __dirname,
  "../uploads/student-tutorials"
);

/* Ensure directory exists */
if (!fs.existsSync(uploadBaseDir)) {
  fs.mkdirSync(uploadBaseDir, { recursive: true });
}

/* ---------------------------------------------------
   SERVE UPLOADS
   URL:
   /api/student-tutorials/uploads/...
--------------------------------------------------- */
router.use(
  "/uploads",
  express.static(uploadBaseDir)
);

/* ---------------------------------------------------
   MULTER CONFIG
--------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadBaseDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

/* ---------------------------------------------------
   GET ALL STUDENT TUTORIALS (ADMIN)
--------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const data = await StudentTutorial.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ---------------------------------------------------
   GET SINGLE STUDENT TUTORIAL BY ID
--------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const data = await StudentTutorial.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Student Tutorial not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ---------------------------------------------------
   CREATE STUDENT TUTORIAL
--------------------------------------------------- */
router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name || !description || !req.file) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const tutorial = await StudentTutorial.create({
        name,
        description,
        image: `/api/student-tutorials/uploads/${req.file.filename}`,
      });

      res.status(201).json({
        success: true,
        message: "Student Tutorial added successfully",
        data: tutorial,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

/* ---------------------------------------------------
   UPDATE STUDENT TUTORIAL
--------------------------------------------------- */
router.put(
  "/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const tutorial = await StudentTutorial.findById(req.params.id);

      if (!tutorial || tutorial.isDeleted) {
        return res.status(404).json({
          success: false,
          message: "Student Tutorial not found",
        });
      }

      /* TEXT FIELDS */
      if (req.body.name !== undefined) {
        tutorial.name = req.body.name;
      }

      if (req.body.description !== undefined) {
        tutorial.description = req.body.description;
      }

      /* IMAGE */
      if (req.file) {
        tutorial.image =
          `/api/student-tutorials/uploads/${req.file.filename}`;
      }

      await tutorial.save();

      res.json({
        success: true,
        message: "Student Tutorial updated successfully",
        data: tutorial,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

/* ---------------------------------------------------
   SOFT DELETE STUDENT TUTORIAL
--------------------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const tutorial = await StudentTutorial.findById(req.params.id);

    if (!tutorial || tutorial.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Student Tutorial not found",
      });
    }

    tutorial.isDeleted = true;
    tutorial.deletedAt = new Date();

    await tutorial.save();

    res.json({
      success: true,
      message: "Student Tutorial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
