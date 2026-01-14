import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ClubImtData from "../models/Clubimtdata.js";

const router = express.Router();

/* ==================================================
   BASE UPLOAD PATH
================================================== */
const UPLOAD_ROOT = path.join(process.cwd(), "src", "uploads");
const BASE_DIR = path.join(UPLOAD_ROOT, "club-imt-data");

const TAB_IMAGE_DIR = path.join(BASE_DIR, "tab-image");
const MAIN_IMAGE_DIR = path.join(BASE_DIR, "main-image");
const EVENTS_DIR = path.join(BASE_DIR, "events");

/* Create folders if missing */
[TAB_IMAGE_DIR, MAIN_IMAGE_DIR, EVENTS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* ==================================================
   MULTER CONFIG
================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "tab_image") return cb(null, TAB_IMAGE_DIR);
    if (file.fieldname === "tab_main_image") return cb(null, MAIN_IMAGE_DIR);
    if (file.fieldname === "our_events") return cb(null, EVENTS_DIR);
    cb(null, BASE_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `club-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

/* ==================================================
   GET ALL (NON-DELETED)
================================================== */
router.get("/", async (req, res) => {
  try {
    const data = await ClubImtData.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ==================================================
   GET SINGLE
================================================== */
router.get("/:id", async (req, res) => {
  try {
    const data = await ClubImtData.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ==================================================
   CREATE CLUB IMT DATA
================================================== */
router.post(
  "/",
  upload.fields([
    { name: "tab_image", maxCount: 1 },
    { name: "tab_main_image", maxCount: 1 },
    { name: "our_events", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { tab_title, tab_content } = req.body;

      if (!tab_title || !tab_content)
        return res.status(400).json({
          success: false,
          message: "Tab title and content are required",
        });

      if (!req.files?.tab_image || !req.files?.tab_main_image)
        return res.status(400).json({
          success: false,
          message: "Tab image and main image are required",
        });

      const record = await ClubImtData.create({
        tab_title,
        tab_content,
        tab_image: `/uploads/club-imt-data/tab-image/${req.files.tab_image[0].filename}`,
        tab_main_image: `/uploads/club-imt-data/main-image/${req.files.tab_main_image[0].filename}`,
        our_events: req.files.our_events
          ? req.files.our_events.map(
              (f) => `/uploads/club-imt-data/events/${f.filename}`
            )
          : [],
      });

      res.status(201).json({ success: true, data: record });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

/* ==================================================
   UPDATE CLUB IMT DATA
================================================== */
/* ==================================================
   UPDATE CLUB IMT DATA
================================================== */
router.put(
  "/:id",
  upload.fields([
    { name: "tab_image", maxCount: 1 },
    { name: "tab_main_image", maxCount: 1 },
    { name: "our_events", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const record = await ClubImtData.findOne({
        _id: req.params.id,
        isDeleted: false,
      });

      if (!record) {
        return res
          .status(404)
          .json({ success: false, message: "Record not found" });
      }

      /* ===============================
         TEXT FIELDS
      ================================ */
      if (req.body.tab_title) record.tab_title = req.body.tab_title;
      if (req.body.tab_content) record.tab_content = req.body.tab_content;

      /* ===============================
         SINGLE IMAGES
      ================================ */
      if (req.files?.tab_image) {
        record.tab_image = `/uploads/club-imt-data/tab-image/${req.files.tab_image[0].filename}`;
      }

      if (req.files?.tab_main_image) {
        record.tab_main_image = `/uploads/club-imt-data/main-image/${req.files.tab_main_image[0].filename}`;
      }

      /* ===============================
         REMOVE EXISTING EVENT IMAGES
      ================================ */
      if (req.body.remove_events) {
        const removeList = Array.isArray(req.body.remove_events)
          ? req.body.remove_events
          : [req.body.remove_events];

        // 1️⃣ Remove from DB
        record.our_events = record.our_events.filter(
          (img) => !removeList.includes(img)
        );

        // 2️⃣ Remove from disk
        removeList.forEach((imgPath) => {
          const cleanPath = imgPath.startsWith("/")
            ? imgPath.slice(1)
            : imgPath;

          const filePath = path.join(process.cwd(), "src", cleanPath);

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }

      /* ===============================
         ADD NEW EVENT IMAGES
      ================================ */
      if (req.files?.our_events) {
        const newImages = req.files.our_events.map(
          (file) => `/uploads/club-imt-data/events/${file.filename}`
        );

        record.our_events.push(...newImages);
      }

      await record.save();

      res.json({
        success: true,
        message: "Club IMT updated successfully",
        data: record,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


/* ==================================================
   SOFT DELETE
================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const record = await ClubImtData.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });

    record.isDeleted = true;
    record.deletedAt = new Date();
    await record.save();

    res.json({
      success: true,
      message: "Club IMT data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
