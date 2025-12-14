import express from "express";
import StudentActivities from "../models/StudentActivities.js";

const router = express.Router();

/* ------------------ 📌 Seed Sample Data ------------------ */
// Call this once: GET → /api/student-activities/seed
router.get("/seed", async (req, res) => {
  try {
    const seedData = [
      { title: "Sports Club", content: "<p>Sports activities and events</p>" },
      {
        title: "Cultural Fest",
        content: "<p>Annual fest with competitions</p>",
      },
      { title: "Tech Club", content: "<p>Workshops and coding events</p>" },
    ];

    await StudentActivities.insertMany(seedData);
    res.json({ success: true, message: "Seed data inserted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seeding failed!" });
  }
});

/* ------------------ 📌 Fetch All Active ------------------ */
// GET → /api/student-activities
router.get("/", async (req, res) => {
  try {
    const activities = await StudentActivities.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data" });
  }
});

/* ------------------ 📌 Update Title + Content ------------------ */
// PUT → /api/student-activities/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await StudentActivities.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
      },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed!" });
  }
});

/* ------------------ 📌 Soft Delete ------------------ */
// DELETE → /api/student-activities/:id
router.delete("/:id", async (req, res) => {
  try {
    await StudentActivities.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed!" });
  }
});


/* ------------------ 📌 Create New Activity ------------------ */
// POST → /api/student-activities
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required!" });
    }

    const newActivity = new StudentActivities({
      title,
      content: content || "",
    });

    const saved = await newActivity.save();

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error("Insert Error:", error);
    res.status(500).json({ message: "Failed to insert data!" });
  }
});

export default router;
