import express from "express";
import Faq from "../models/Faq.js";

const router = express.Router();

/* -------------------- ADD FAQ -------------------- */
router.post("/add", async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ msg: "Question and Answer are required" });
    }

    const faq = await Faq.create({ question, answer });

    res.json({ msg: "FAQ added successfully", data: faq });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

/* -------------------- GET ALL FAQS -------------------- */
router.get("/all", async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
    res.json({ data: faqs });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

/* -------------------- GET SINGLE FAQ -------------------- */
router.get("/:id", async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);

    if (!faq)
      return res.status(404).json({ msg: "FAQ not found" });

    res.json({ data: faq });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

/* -------------------- UPDATE FAQ -------------------- */
router.put("/:id", async (req, res) => {
  try {
    const { question, answer } = req.body;

    const updated = await Faq.findByIdAndUpdate(
      req.params.id,
      { question, answer },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ msg: "FAQ not found" });

    res.json({ msg: "FAQ updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

/* -------------------- DELETE FAQ -------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Faq.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ msg: "FAQ not found" });

    res.json({ msg: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default router;
