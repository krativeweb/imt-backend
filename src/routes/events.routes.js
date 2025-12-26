import express from "express";
import Event from "../models/Events.js";

const router = express.Router();

/* ===============================
   GET ALL EVENTS (NON-DELETED)
================================ */
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({
      isDeleted: false,
    }).sort({
      event_date: 1,
      event_time: 1, // 👈 sort by time also
    });

    res.json({
      success: true,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   GET SINGLE EVENT
================================ */
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD EVENT
================================ */
router.post("/", async (req, res) => {
  try {
    const {
      event_date,
      event_time, // 👈 added
      event_title,
      event_place,
    } = req.body;

    if (!event_date || !event_time || !event_title || !event_place) {
      return res.status(400).json({
        success: false,
        message:
          "Event date, time, title, and place are required",
      });
    }

    const event = await Event.create({
      event_date,
      event_time, // 👈 save
      event_title,
      event_place,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE EVENT
================================ */
router.put("/:id", async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const {
      event_date,
      event_time, // 👈 added
      event_title,
      event_place,
    } = req.body;

    if (event_date) event.event_date = event_date;
    if (event_time) event.event_time = event_time; // 👈 update
    if (event_title) event.event_title = event_title;
    if (event_place) event.event_place = event_place;

    await event.save();

    res.json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   SOFT DELETE EVENT
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    event.isDeleted = true;
    event.deletedAt = new Date();
    await event.save();

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
