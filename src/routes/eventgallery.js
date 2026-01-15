import express from "express";
import EventGallery from "../models/EventGallery.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===============================
   MULTER CONFIG
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/event-gallery/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp|gif/;
    if (!allowed.test(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

/* ===============================
   ADD EVENT GALLERY
================================ */
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Image is required" });
    }

    const newGallery = await EventGallery.create({
      image: `uploads/event-gallery/${req.file.filename}`,
      content: req.body.content || "",
    });

    res.json({ msg: "Event Gallery Added Successfully", data: newGallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   EDIT EVENT GALLERY
================================ */
router.put("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {};

    // update content only if sent
    if (req.body.content !== undefined) {
      updateData.content = req.body.content;
    }

    // update image only if new image uploaded
    if (req.file) {
      updateData.image = `uploads/event-gallery/${req.file.filename}`;
    }

    const updated = await EventGallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ msg: "Event Gallery Updated Successfully", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   SOFT DELETE EVENT GALLERY
================================ */
router.delete("/delete/:id", async (req, res) => {
  try {
    await EventGallery.findByIdAndUpdate(req.params.id, { isDel: true });
    res.json({ msg: "Event Gallery Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ===============================
   GET ALL ACTIVE EVENT GALLERY
================================ */
router.get("/", async (req, res) => {
  try {
    const data = await EventGallery.find({ isDel: false }).sort({
      createdAt: -1,
    });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
