import express from "express";
import CallToAction from "../models/Newadmission.js";

const router = express.Router();

/* =====================================================
   GET ALL CTA CONTENT (ARRAY)
   GET /api/call-to-action
===================================================== */
router.get("/", async (req, res) => {
  try {
    const data = await CallToAction.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =====================================================
   GET SINGLE CTA (BY ID)
   GET /api/call-to-action/:id
===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const item = await CallToAction.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "CTA not found" });
    }

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =====================================================
   CREATE CTA (ONLY ONE DOCUMENT)
   POST /api/call-to-action
===================================================== */
router.post("/", async (req, res) => {
  try {
    const { cta_content } = req.body;

    if (!cta_content) {
      return res.status(400).json({
        success: false,
        message: "CTA content is required",
      });
    }

    // ❗ Ensure only ONE CTA exists
    const exists = await CallToAction.findOne();
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "CTA already exists. Please update it instead.",
      });
    }

    const newCTA = await CallToAction.create({
      cta_content,
    });

    res.status(201).json({ success: true, data: newCTA });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =====================================================
   UPDATE CTA (EDITOR ONLY)
   PUT /api/call-to-action/:id
===================================================== */
router.put("/:id", async (req, res) => {
  try {
    const { cta_content, is_active } = req.body;

    const updated = await CallToAction.findByIdAndUpdate(
      req.params.id,
      {
        cta_content,
        is_active,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "CTA not found",
      });
    }

    res.json({
      success: true,
      message: "Call-To-Action updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =====================================================
   DELETE CTA (OPTIONAL / ADMIN ONLY)
   DELETE /api/call-to-action/:id
===================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await CallToAction.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "CTA not found" });
    }

    res.json({ success: true, message: "CTA deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
