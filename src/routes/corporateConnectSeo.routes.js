import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import CorporateConnectSeo from "../models/CorporateConnectSeo.js";

const router = express.Router();

/* =======================
   Multer Storage
======================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "src/uploads/banner";

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* =======================
   GET ALL (Fetch Page Data)
======================= */
router.get("/", async (req, res) => {
  try {
    const data = await CorporateConnectSeo.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =======================
   UPDATE BY ID ONLY
======================= */
router.put("/:id", upload.single("banner_image"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.banner_image = `/uploads/banner/${req.file.filename}`;
    }

    const updated = await CorporateConnectSeo.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json({
      message: "Corporate Connect SEO updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
