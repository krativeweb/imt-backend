import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import InboundExchange from "../models/Inboundexchange.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
   src/uploads/inbound-exchange
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "inbound-exchange"
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
    const name = `inbound-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

/* ===============================
   GET ALL (NON-DELETED)
   GET /api/inbound-exchange
================================ */
router.get("/", async (req, res) => {
  try {
    const programs = await InboundExchange.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: programs,
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
   GET /api/inbound-exchange/:id
================================ */
router.get("/:id", async (req, res) => {
  try {
    const program = await InboundExchange.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Inbound Exchange not found",
      });
    }

    res.json({
      success: true,
      data: program,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD INBOUND EXCHANGE
   POST /api/inbound-exchange
================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, content } = req.body;

    if (!name || !content) {
      return res.status(400).json({
        success: false,
        message: "Name and content are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const program = await InboundExchange.create({
      name,
      content,
      image: `uploads/inbound-exchange/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      data: program,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE INBOUND EXCHANGE
   PUT /api/inbound-exchange/:id
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const program = await InboundExchange.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Inbound Exchange not found",
      });
    }

    if (req.body.name) {
      program.name = req.body.name;
    }

    if (req.body.content) {
      program.content = req.body.content;
    }

    // Replace image if new one uploaded
    if (req.file) {
      program.image = `uploads/inbound-exchange/${req.file.filename}`;
    }

    await program.save();

    res.json({
      success: true,
      data: program,
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
   DELETE /api/inbound-exchange/:id
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const program = await InboundExchange.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Inbound Exchange not found",
      });
    }

    program.isDeleted = true;
    program.deletedAt = new Date();
    await program.save();

    res.json({
      success: true,
      message: "Inbound Exchange soft deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
