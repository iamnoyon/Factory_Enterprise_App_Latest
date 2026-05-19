const User = require("../models/user.model");
const { comparePassword, hashPassword } = require("../utils/hash");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    // Check if the password matches
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }
    // If login is successful, return user data (excluding password)
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // token set on cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      status_code: 200,
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};

const userLogoutController = async (req, res) => {
  try {
    // Clear the authentication cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      status_code: 200,
      message: "Logout successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};

const createOwnerController = async (req, res) => {
  try {
    const owner = await User({
      name: "Company Owner",
      email: "owner@gmail.com",
      password: await hashPassword("123456"),
      role: "owner",
      permissions: ["create_user", "read_user", "update_user", "delete_user"],
      status: "active",
    });
    await owner.save();
    res.status(201).json({
      success: true,
      status_code: 201,
      message: "Owner created successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status_code: 500,
      message: `Internal Server Error ${err.message}}`,
    });
  }
};

module.exports = {
  userLoginController,
  userLogoutController,
  createOwnerController,
};
