const User = require("../models/user.model");
const { hashPassword } = require("../utils/hash");
const { sendEmail, sendInvitationEmail } = require("../utils/nodemailer");
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
    sendEmail(name, email, "Your Account Has Been Created", password).catch(
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

const getAllUsersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const status = req.query.status || "";

    // Build filter query
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const users = await User.find(filter)
      .select("-password")
      .select("-permissions")
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      status_code: 200,
      message: "Users retrieved successfully",
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: totalPages,
      },
      users: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};

const getUserDropdownWithPermissionsController = async (req, res) => {
  try {
    const users = await User.find({
      role: { $ne: "owner" },
      status: "approved",
    })
      .select("-password")
      .select("-email")
      .select("-status")
      .select("-createdAt")
      .select("-updatedAt")
      .select("-createdBy")
      .select("-updatedBy")
      .select("-_id")
      .select("-profile_photo");

    res.status(200).json({
      success: true,
      status_code: 200,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};

const updateUserStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const findUser = await User.findOne({ id });

    if (!findUser) {
      return res.status(404).json({
        success: false,
        status_code: 404,
        message: "User not found",
      });
    }

    findUser.status = status === "invitation" ? "pending" : status;

    await findUser.save();

    if (status === "invitation") {
      sendInvitationEmail(
        findUser.email,
        "Congratulations! You have been successfully invited to the application. Your account has been ready for use.",
        "",
      ).catch((err) => {
        console.error("Email sending failed:", err);
      });
    }

    return res.status(200).json({
      success: true,
      status_code: 200,
      message: "User status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status_code: 500,
      message: error.message,
    });
  }
};

// export the controller functions
module.exports = {
  createUserController,
  getCurrentUserController,
  getAllUsersController,
  getUserDropdownWithPermissionsController,
  updateUserStatusController,
};
