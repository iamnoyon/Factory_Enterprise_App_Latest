const mongoose = require("mongoose");
const appConfig = require("./appConfig");

// Connect to MongoDB
mongoose
  .connect(appConfig.db_url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.warn("MongoDB not available, running in offline mode");
  });
