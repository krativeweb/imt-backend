import express from "express";
import LearnAboutProgram from "../models/LearnaboutProgram.js";

const router = express.Router();

/* ===============================
   GET ALL (NON-DELETED)
   GET /api/learn-about-program
================================ */
router.get("/", async (req, res) => {
  try {
    const programs = await LearnAboutProgram.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json(programs);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   GET SINGLE
   GET /api/learn-about-program/:id
================================ */
router.get("/:id", async (req, res) => {
  try {
    const program = await LearnAboutProgram.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Learn About Program not found",
      });
    }

    res.json(program);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   ADD PROGRAM
   POST /api/learn-about-program
================================ */
router.post("/", async (req, res) => {
  try {
    const { title, video_url } = req.body;

    if (!title || !video_url) {
      return res.status(400).json({
        success: false,
        message: "Title and Video URL are required",
      });
    }

    const program = await LearnAboutProgram.create({
      title,
      video_url,
    });

    res.status(201).json({
      success: true,
      data: program,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   UPDATE PROGRAM
   PUT /api/learn-about-program/:id
================================ */
router.put("/:id", async (req, res) => {
  try {
    const program = await LearnAboutProgram.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Learn About Program not found",
      });
    }

    if (req.body.title !== undefined) {
      program.title = req.body.title;
    }

    if (req.body.video_url !== undefined) {
      program.video_url = req.body.video_url;
    }

    await program.save();

    res.json({
      success: true,
      data: program,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ===============================
   SOFT DELETE
   DELETE /api/learn-about-program/:id
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const program = await LearnAboutProgram.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Learn About Program not found",
      });
    }

    program.isDeleted = true;
    program.deletedAt = new Date();
    await program.save();

    res.json({
      success: true,
      message: "Learn About Program deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
