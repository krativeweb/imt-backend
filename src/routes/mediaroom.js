import express from "express";
import MediaRoom from "../models/MediaRoom.js";

const router = express.Router();

/* ===============================
   GET ALL MEDIA (NON-DELETED)
   GET /api/media-room
================================ */
router.get("/", async (req, res) => {
  try {
    const media = await MediaRoom.find({
      isDeleted: false,
    }).sort({ year: -1, createdAt: -1 });

    res.json({
      success: true,
      data: media,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   GET SINGLE MEDIA
   GET /api/media-room/:id
================================ */
router.get("/:id", async (req, res) => {
  try {
    const media = await MediaRoom.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media item not found",
      });
    }

    res.json({
      success: true,
      data: media,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD MEDIA
   POST /api/media-room
================================ */
router.post("/", async (req, res) => {
  try {
    const { title, year, content } = req.body;

    if (!title || !year || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, Year and Content are required",
      });
    }

    const media = await MediaRoom.create({
      title,
      year,
      content,
    });

    res.status(201).json({
      success: true,
      data: media,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE MEDIA
   PUT /api/media-room/:id
================================ */
router.put("/:id", async (req, res) => {
  try {
    const media = await MediaRoom.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media item not found",
      });
    }

    /* UPDATE FIELDS */
    if (req.body.title !== undefined) media.title = req.body.title;
    if (req.body.year !== undefined) media.year = req.body.year;
    if (req.body.content !== undefined) media.content = req.body.content;

    await media.save();

    res.json({
      success: true,
      data: media,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   SOFT DELETE MEDIA
   DELETE /api/media-room/:id
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const media = await MediaRoom.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media item not found",
      });
    }

    media.isDeleted = true;
    media.deletedAt = new Date();
    await media.save();

    res.json({
      success: true,
      message: "Media item deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
