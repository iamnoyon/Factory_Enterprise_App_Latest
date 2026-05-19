const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Define the User schema
const userSchema = mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["owner", "admin", "manager", "employee", "customer"],
        default: null
    },
    permissions: {
        type: [String],
        enum: [
            "create_user",
            "read_user",
            "update_user",
            "delete_user",
        ],
        default: []
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended", "pending"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        default: "system"
    },
    updatedBy: {
        type: String,
        default: "system"
    }
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;