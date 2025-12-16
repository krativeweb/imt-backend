import express from "express";
import LrcFaq from "../models/LrcFaq.js";

const router = express.Router();

/* ---------------------------------------------------
   CREATE FAQ
--------------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and Answer are required",
      });
    }

    const faq = await LrcFaq.create({ question, answer });

    res.status(201).json({
      success: true,
      message: "FAQ added successfully",
      data: faq,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ---------------------------------------------------
   GET ALL FAQs (exclude deleted)
--------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const faqs = await LrcFaq.find({ isDeleted: false }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ---------------------------------------------------
   GET SINGLE FAQ
--------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const faq = await LrcFaq.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ---------------------------------------------------
   UPDATE FAQ (EDIT)
--------------------------------------------------- */
router.put("/:id", async (req, res) => {
  try {
    const { question, answer } = req.body;

    const faq = await LrcFaq.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { question, answer },
      { new: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.json({
      success: true,
      message: "FAQ updated successfully",
      data: faq,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ---------------------------------------------------
   SOFT DELETE FAQ
--------------------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const faq = await LrcFaq.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
