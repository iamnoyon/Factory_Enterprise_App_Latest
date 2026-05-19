const mongoose = require("mongoose");
const appConfig = require("./appConfig");

// Connect to MongoDB
mongoose.connect(appConfig.db_url)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});