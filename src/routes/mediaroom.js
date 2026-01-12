import express from "express";
import MediaRoom from "../models/MediaRoom.js";

const router = express.Router();

/* =====================================================
   GET ALL MEDIA (NON-DELETED)
   GET /api/media-room
===================================================== */
router.get("/", async (req, res) => {
  try {
    const media = await MediaRoom.find({ isDeleted: false })
      .sort({ year: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error("GET MEDIA ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch media",
    });
  }
});

/* =====================================================
   GET SINGLE MEDIA
   GET /api/media-room/:id
===================================================== */
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

    return res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error("GET MEDIA BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch media",
    });
  }
});

/* =====================================================
   ADD MEDIA
   POST /api/media-room
===================================================== */
router.post("/", async (req, res) => {
  try {
    const { title, year, content } = req.body;

    const media = await MediaRoom.create({
      title,
      year: Number(year),
      content,
    });

    return res.status(201).json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error("CREATE MEDIA ERROR ❌", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



/* =====================================================
   UPDATE MEDIA
   PUT /api/media-room/:id
===================================================== */
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

    const { title, year, content } = req.body;

    if (typeof title === "string") media.title = title.trim();
    if (typeof year === "number") media.year = year;
    if (typeof content === "string") media.content = content;

    await media.save();

    return res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error("UPDATE MEDIA ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update media",
    });
  }
});

/* =====================================================
   SOFT DELETE MEDIA
   DELETE /api/media-room/:id
===================================================== */
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

    return res.status(200).json({
      success: true,
      message: "Media item deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MEDIA ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete media",
    });
  }
});

export default router;
