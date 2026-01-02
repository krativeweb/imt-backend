import express from "express";
import Conference from "../models/ConferenceDetails.js";

const router = express.Router();

/* ===============================
   GET ALL CONFERENCES (NON-DELETED)
================================ */
router.get("/", async (req, res) => {
  try {
    const conferences = await Conference.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: conferences });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   GET SINGLE CONFERENCE
================================ */
router.get("/:id", async (req, res) => {
  try {
    const conference = await Conference.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    res.json({ success: true, data: conference });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD CONFERENCE
================================ */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      date,
      conference,
      theme,
      support,
      journal,
      brochure,
    } = req.body;

    if (!title || !date || !conference || !theme) {
      return res.status(400).json({
        success: false,
        message:
          "Title, date, conference name and theme are required",
      });
    }

    const newConference = await Conference.create({
      title,
      date,
      conference,
      theme,
      support,
      journal,
      brochure,
    });

    res.status(201).json({
      success: true,
      data: newConference,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE CONFERENCE
================================ */
router.put("/:id", async (req, res) => {
  try {
    const conferenceData = await Conference.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!conferenceData) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    const fields = [
      "title",
      "date",
      "conference",
      "theme",
      "support",
      "journal",
      "brochure",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        conferenceData[field] = req.body[field];
      }
    });

    await conferenceData.save();

    res.json({
      success: true,
      data: conferenceData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   SOFT DELETE CONFERENCE
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const conference = await Conference.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: "Conference not found",
      });
    }

    conference.isDeleted = true;
    conference.deletedAt = new Date();
    await conference.save();

    res.json({
      success: true,
      message: "Conference deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
