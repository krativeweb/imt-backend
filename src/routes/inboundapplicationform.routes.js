import express from "express";
import InboundApplicationForm from "../models/Inboundapplicationform.js";

const router = express.Router();

/* ==============================
   CREATE OR UPDATE (SINGLETON)
   If record exists → update
   Else → create
================================ */
router.post("/", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    // Singleton logic
    const existing = await InboundApplicationForm.findOne();

    if (existing) {
      existing.content = content;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Inbound Application Form updated successfully",
        data: existing,
      });
    }

    const created = await InboundApplicationForm.create({ content });

    res.status(201).json({
      success: true,
      message: "Inbound Application Form created successfully",
      data: created,
    });
  } catch (error) {
    console.error("Inbound POST error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ==============================
   READ (SINGLE RECORD)
================================ */
router.get("/", async (req, res) => {
  try {
    const data = await InboundApplicationForm.findOne();

    res.status(200).json(data || null);
  } catch (error) {
    console.error("Inbound GET error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ==============================
   READ BY ID
================================ */
router.get("/:id", async (req, res) => {
  try {
    const data = await InboundApplicationForm.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Inbound GET by ID error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ==============================
   UPDATE BY ID (JSON ONLY)
================================ */
router.put("/:id", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const updated = await InboundApplicationForm.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inbound Application Form updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Inbound PUT error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ==============================
   DELETE (OPTIONAL – CMS ONLY)
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await InboundApplicationForm.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inbound Application Form deleted successfully",
    });
  } catch (error) {
    console.error("Inbound DELETE error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
