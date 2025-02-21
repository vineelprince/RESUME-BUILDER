const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./database"); // Import database connection
const userRoutes = require("./routes/userRoutes"); // Import User Routes
const resumeRoutes = require("./routes/resumeRoutes"); // Import Resume Routes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Simple test route
app.get("/", (req, res) => {
    res.send("AI Resume Builder Backend is Running");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);

// Define PORT from .env or use default 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
