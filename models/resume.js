const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resumeData: Object, // Store JSON data of resume
});

module.exports = mongoose.model("Resume", ResumeSchema);
