import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import AdvisoryCouncilCSR from "../models/Advisorycouncilcsr.js";

const router = express.Router();

/* ===============================
   UPLOAD DIRECTORY
================================ */
const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "advisory-council-csr"
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
    const name = `member-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

/* =====================================================
   GET ALL MEMBERS (OPTIONAL TYPE FILTER)
   GET /api/advisory-council-csr?type=ADVISORY_COUNCIL
===================================================== */
router.get("/", async (req, res) => {
  try {
    const filter = { isDeleted: false };

    if (req.query.type) {
      filter.type = req.query.type;
    }

    const members = await AdvisoryCouncilCSR.find(filter).sort({
      createdAt: -1,
    });

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
   GET SINGLE MEMBER
================================ */
router.get("/:id", async (req, res) => {
  try {
    const member = await AdvisoryCouncilCSR.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
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
================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { type, name, designation, role_expertise } = req.body;

    if (!type || !name || !designation || !role_expertise) {
      return res.status(400).json({
        success: false,
        message:
          "Type, name, designation and role/expertise are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const member = await AdvisoryCouncilCSR.create({
      type,
      name,
      designation,
      role_expertise,
      image: `uploads/advisory-council-csr/${req.file.filename}`,
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
================================ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const member = await AdvisoryCouncilCSR.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (req.body.type) member.type = req.body.type;
    if (req.body.name) member.name = req.body.name;
    if (req.body.designation)
      member.designation = req.body.designation;
    if (req.body.role_expertise)
      member.role_expertise = req.body.role_expertise;

    if (req.file) {
      member.image = `uploads/advisory-council-csr/${req.file.filename}`;
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
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const member = await AdvisoryCouncilCSR.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    member.isDeleted = true;
    member.deletedAt = new Date();
    await member.save();

    res.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
