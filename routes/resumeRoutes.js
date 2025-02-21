const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume"); // Resume model (to be created)

// Save Resume
router.post("/save", async (req, res) => {
    try {
        const { userId, resumeData } = req.body;

        const newResume = new Resume({ userId, resumeData });
        await newResume.save();

        res.status(201).json({ message: "Resume saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// Get User's Resume
router.get("/:userId", async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.params.userId });

        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;
