import express from "express";
import EventCalendar from "../models/Eventcalender.js";

const router = express.Router();

/* ===============================
   GET ALL EVENTS (NON-DELETED)
================================ */
router.get("/", async (req, res) => {
  try {
    const events = await EventCalendar.find({
      isDeleted: false,
    }).sort({
      event_date: 1,
      start_time: 1, // 👈 sort by start time
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
    const event = await EventCalendar.findOne({
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
   ADD EVENT (CALENDAR)
================================ */
router.post("/", async (req, res) => {
  try {
    const {
      event_date,
      start_time,
      end_time,
      event_title,
      event_place,
    } = req.body;

    if (
      !event_date ||
      !start_time ||
      !end_time ||
      !event_title ||
      !event_place
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Event date, start time, end time, title, and place are required",
      });
    }

    if (end_time <= start_time) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    const event = await EventCalendar.create({
      event_date,
      start_time,
      end_time,
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
   UPDATE EVENT (CALENDAR)
================================ */
router.put("/:id", async (req, res) => {
  try {
    const event = await EventCalendar.findOne({
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
      start_time,
      end_time,
      event_title,
      event_place,
    } = req.body;

    if (event_date) event.event_date = event_date;
    if (start_time) event.start_time = start_time;
    if (end_time) event.end_time = end_time;
    if (event_title) event.event_title = event_title;
    if (event_place) event.event_place = event_place;

    if (
      event.start_time &&
      event.end_time &&
      event.end_time <= event.start_time
    ) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

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
    const event = await EventCalendar.findOne({
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
