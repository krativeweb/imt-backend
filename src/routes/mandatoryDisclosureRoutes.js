import express from "express";
import MandatoryPage from "../models/MandatoryPage.js";
import { auth } from "../middlewares/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Storage settings
// Storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "src/uploads/banners";

    if (file.fieldname === "gallery_images[]") {
      uploadPath = "src/uploads/gallery";
    }

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

// Get all pages
router.get("/", auth, async (req, res) => {
  try {
    const { page_parent } = req.query;

    let filter = {};
    if (page_parent) {
      filter.page_parent = page_parent;
    }

    const pages = await MandatoryPage.find(filter).sort({ createdAt: 1 });

    res.json({ success: true, pages });
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get page by ID
router.get("/:id", auth, async (req, res) => {
  const page = await MandatoryPage.findById(req.params.id);
  if (!page)
    return res.status(404).json({ success: false, message: "Page not found" });

  res.json({ success: true, page });
});

// Update page by ID
// Update page by ID
router.put(
  "/:id",
  auth,
  upload.fields([
    { name: "banner_image", maxCount: 1 },
    { name: "gallery_images[]", maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const pageId = req.params.id;
      const updateData = { ...req.body };

      let updateQuery = { $set: {} };

      // Only allow valid text fields in $set
      Object.keys(updateData).forEach((key) => {
        if (key !== "gallery_images" && key !== "remove_gallery_images") {
          updateQuery.$set[key] = updateData[key];
        }
      });

      //
      // 1️⃣ Handle Banner Upload
      //
      if (req.files?.banner_image?.length > 0) {
        const file = req.files.banner_image[0];
        updateQuery.$set.banner_image = `/uploads/banners/${file.filename}`;
      }

      //
      // 2️⃣ Handle New Gallery Uploads
      //
      const galleryFiles = req.files?.["gallery_images[]"];
      if (galleryFiles && galleryFiles.length > 0) {
        const galleryPaths = galleryFiles.map(
          (file) => `/uploads/gallery/${file.filename}`
        );
        if (!updateQuery.$push) updateQuery.$push = {};
        updateQuery.$push.gallery_images = { $each: galleryPaths };
      }

      //
      // 3️⃣ Handle Remove Gallery
      //
      let deleteList = req.body.remove_gallery_images;
      if (typeof deleteList === "string") deleteList = [deleteList];

      if (Array.isArray(deleteList) && deleteList.length > 0) {
        if (!updateQuery.$pull) updateQuery.$pull = {};
        updateQuery.$pull.gallery_images = { $in: deleteList };

        // remove actual files
        deleteList.forEach((img) => {
          const cleanFile = img.replace(/^\/+/, "");
          const filePath = path.join(process.cwd(), cleanFile);

          if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        });
      }

      // Execute database update
      const updated = await MandatoryPage.findByIdAndUpdate(pageId, updateQuery, {
        new: true,
      });

      if (!updated) {
        return res.status(404).json({ success: false, message: "Page not found" });
      }

      res.json({
        success: true,
        message: "Updated successfully",
        page: updated,
      });
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);



export default router;
