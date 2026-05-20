const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// routes imports
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.route");
const attachmentRoutes = require("./routes/attachment.route");

// Create an Express application
const app = express();

// Connect to the database
require("./config/db");

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads")); // Serve static files from the "uploads" directory

// Use the routes
app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/attachment", attachmentRoutes);
// handle client errors
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

// handle server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// export the app for use in other files (like server.js)
module.exports = app;
