import express from "express";
import InternationalAssociationGallery from "../models/InternationalAssociationGallery.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -----------------------------
   MULTER STORAGE CONFIG
------------------------------ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(__dirname, "../uploads/international-association-gallery/")
    );
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

/* -----------------------------
        ADD GALLERY
------------------------------ */
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { title } = req.body;

    if (!title)
      return res.status(400).json({ msg: "Title is required" });

    if (!req.file)
      return res.status(400).json({ msg: "Image is required" });

    const newGallery = await InternationalAssociationGallery.create({
      title,
      image: `uploads/international-association-gallery/${req.file.filename}`,
    });

    res.json({ msg: "Added Successfully", data: newGallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
        EDIT GALLERY
------------------------------ */
router.put("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
    };

    if (req.file) {
      updateData.image = `uploads/international-association-gallery/${req.file.filename}`;
    }

    const updated =
      await InternationalAssociationGallery.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

    res.json({ msg: "Updated Successfully", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
        SOFT DELETE
------------------------------ */
router.delete("/delete/:id", async (req, res) => {
  try {
    await InternationalAssociationGallery.findByIdAndUpdate(req.params.id, {
      isDel: true,
    });
    res.json({ msg: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -----------------------------
        GET ALL (ACTIVE)
------------------------------ */
router.get("/", async (req, res) => {
  try {
    const data = await InternationalAssociationGallery.find({
      isDel: false,
    }).sort({ createdAt: -1 });

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
