import express from "express";
import PhotoGallery from "../models/PhotoGallery.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/photo-gallery/")); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Only allow image files
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp|gif/;
    if (!allowed.test(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

// Add
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ msg: "Image is required" });

    const newGallery = await PhotoGallery.create({
     image: `uploads/photo-gallery/${req.file.filename}`,
      content: req.body.content || "",
    });

    res.json({ msg: "Added Successfully", data: newGallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit
router.put("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      content: req.body.content || "",
    };

    if (req.file) {
      updateData.image = `uploads/photo-gallery/${req.file.filename}`; // SAME AS ADD API
    }

    const updated = await PhotoGallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ msg: "Updated Successfully", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Soft Delete
router.delete("/delete/:id", async (req, res) => {
  try {
    await PhotoGallery.findByIdAndUpdate(req.params.id, { isDel: true });
    res.json({ msg: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Active
router.get("/", async (req, res) => {
  try {
    const data = await PhotoGallery.find({ isDel: false }).sort({ createdAt: -1 });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
