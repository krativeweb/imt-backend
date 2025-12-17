import express from "express";
import UspSection from "../models/UspSection.js";
import multer from "multer";
const router = express.Router();

const upload = multer()
/* =====================================================
   GET USP CONTENT (SINGLE)
===================================================== */
router.get("/", async (req, res) => {
  try {
    const usp = await UspSection.findOne();

    return res.status(200).json({
      success: true,
      data: usp || null,
    });
  } catch (error) {
    console.error("USP FETCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch USP content",
    });
  }
});

/* =====================================================
   UPDATE USP CONTENT (ONLY EDIT)
===================================================== */
router.put("/:id", upload.none(), async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); // ✅ now works

    const { content } = req.body;

    // allow empty HTML, just block missing field
    if (content === undefined || content === null) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const usp = await UspSection.findById(req.params.id);
    if (!usp) {
      return res.status(404).json({
        success: false,
        message: "USP content not found",
      });
    }

    usp.content = content; // store raw HTML
    await usp.save();

    return res.status(200).json({
      success: true,
      message: "USP content updated successfully",
      data: usp,
    });
  } catch (error) {
    console.error("USP UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update USP content",
    });
  }
});

export default router;
