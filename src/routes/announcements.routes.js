import express from "express";
import Announcement from "../models/Announcements.js";

const router = express.Router();

/* ===============================
   GET ALL ANNOUNCEMENTS (NON-DELETED)
================================ */
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: announcements,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   GET SINGLE ANNOUNCEMENT
================================ */
router.get("/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.json({
      success: true,
      data: announcement,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD ANNOUNCEMENT
================================ */
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const announcement = await Announcement.create({
      title,
      description,
    });

    res.status(201).json({
      success: true,
      data: announcement,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE ANNOUNCEMENT
================================ */
router.put("/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    const { title, description } = req.body;

    if (title) announcement.title = title;
    if (description) announcement.description = description;

    await announcement.save();

    res.json({
      success: true,
      data: announcement,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   SOFT DELETE ANNOUNCEMENT
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    announcement.isDeleted = true;
    announcement.deletedAt = new Date();
    await announcement.save();

    res.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
