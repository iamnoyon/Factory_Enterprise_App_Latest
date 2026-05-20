const User = require("../models/user.model");
const { hashPassword } = require("../utils/hash");
const { sendEmail } = require("../utils/nodemailer");
const { generateRandomPassword } = require("../utils/passGenerate");

// Create a new user
const createUserController = async (req, res) => {
  try {
    const { name, email } = req.body;
    const password = generateRandomPassword();

    const find_user = await User.findOne({ email: email });
    if (find_user) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "User with this email already exists",
      });
    }

    const new_user = new User({
      name: name,
      email: email,
      password: await hashPassword(password),
      createdBy: req.user.id,
    });
    await new_user.save();

    // Send email asynchronously (don't wait for it)
    sendEmail(name, email, "Your Account Has Been Created", password)
    .catch(
      (err) => {
        console.error("Email sending failed:", err);
      },
    );

    res.status(201).json({
      success: true,
      status_code: 201,
      message:
        "User created successfully! Password has been sent to the email.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status_code: 500,
      message: `Internal Server Error ${err.message}}`,
    });
  }
};

const getCurrentUserController = async (req, res) => {
  const { id, email, role } = req.user;

  try {
    const user = await User.findOne({ id: id }).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      status_code: 200,
      message: "User data retrieved successfully",
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};

// export the controller functions
module.exports = {
  createUserController,
  getCurrentUserController,
};
