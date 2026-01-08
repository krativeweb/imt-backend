import express from "express";
import CorporateConnect from "../models/CorporateConnect.js";

const router = express.Router();

/* CREATE */
router.post("/", async (req, res) => {
  try {
    const { tab_type, academic_year, tab_content } = req.body;

    if (!tab_type || !academic_year || !tab_content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const data = await CorporateConnect.create({
      tab_type,
      academic_year,
      tab_content,
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* READ ALL (exclude soft deleted + filters) */
router.get("/", async (req, res) => {
  try {
    const { tab_type, academic_year } = req.query;

    const filter = { is_deleted: false };

    if (tab_type) filter.tab_type = tab_type;
    if (academic_year) filter.academic_year = academic_year;

    const data = await CorporateConnect.find(filter).sort({
      createdAt: -1,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* READ SINGLE */
router.get("/:id", async (req, res) => {
  try {
    const data = await CorporateConnect.findOne({
      _id: req.params.id,
      is_deleted: false,
    });

    if (!data) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE */
router.put("/:id", async (req, res) => {
  try {
    const updated = await CorporateConnect.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* SOFT DELETE */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await CorporateConnect.findByIdAndUpdate(
      req.params.id,
      { is_deleted: true },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record soft deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
