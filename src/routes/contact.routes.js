import express from "express";
import Contact from "../models/Contact.model.js";
import sendContactEmail from "../utils/sendEmail.js";

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      category,
      message,
    } = req.body;

    // 🔒 Validation
    if (!firstName || !email || !message || !category) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // 💾 Save to MongoDB
    await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      category,
      message,
    });

    // ✉️ Send email based on category
    await sendContactEmail({
      firstName,
      lastName,
      email,
      phone,
      category,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  }  catch (error) {
  console.error("🔥 CONTACT API ERROR FULL:", error);

  res.status(500).json({
    success: false,
    message: error.message, // 👈 THIS IS KEY
  });
}
});

export default router;
5
