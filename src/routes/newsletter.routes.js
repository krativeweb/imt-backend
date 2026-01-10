import express from "express";
import Newsletter from "../models/Newsletter.js";

const router = express.Router();

// ✅ CREATE Newsletter
router.post("/", async (req, res) => {
  try {
    const { month, year, pdfUrl, isActive } = req.body;

    if (!month || !year || !pdfUrl) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const newsletter = await Newsletter.create({
      month,
      year,
      pdfUrl,

    });

    return res.status(201).json(newsletter);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ✅ GET All (Exclude soft deleted)
router.get("/", async (req, res) => {
  try {
    const newsletters = await Newsletter.find({ isDeleted: false }).sort({
      year: -1,
      createdAt: -1,
    });

    return res.json(newsletters);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ✅ GET Single
router.get("/:id", async (req, res) => {
  try {
    const newsletter = await Newsletter.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!newsletter) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.json(newsletter);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ✅ UPDATE Newsletter
router.put("/:id", async (req, res) => {
  try {
    const updated = await Newsletter.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 🗑️ SOFT DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Newsletter.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
      },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.json({ message: "Newsletter soft deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
