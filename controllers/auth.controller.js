const User = require("../models/user.model");
const { comparePassword, hashPassword } = require("../utils/hash");
const { sendEmail } = require("../utils/nodemailer");
const { generateRandomPassword } = require("../utils/passGenerate");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const path = require("path");

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
    if (user?.status === "suspended") {
      return res.status(403).json({
        success: false,
        status_code: 403,
        message:
          "This account is suspended. Pleasse contact with administrator.",
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

    return res.status(200).json({
      success: true,
      status_code: 200,
      message: "Login successful",
    });
  } catch (err) {
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      status_code: 200,
      message: "Logout successful",
    });
  } catch (err) {
    return res.status(500).json({
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
    return res.status(201).json({
      success: true,
      status_code: 201,
      message: "Owner created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status_code: 500,
      message: `Internal Server Error ${err.message}}`,
    });
  }
};

const changePasswordController = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { id, email } = req.user;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "New password and confirm password do not match",
      });
    }

    const user = await User.findOne({ email: email });
    user.password = await hashPassword(newPassword);
    await user.save();

    return res.status(200).json({
      success: true,
      status_code: 200,
      message: "Password changed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status_code: 500,
      message: `Internal Server Error ${err.message}}`,
    });
  }
};

const updateProfilePhotoController = async (req, res) => {
  try {
    const { id, email } = req.user;
    const { fileName } = req.body;

    const user = await User.findOne({ email: email });
    user.profile_photo = `${process.env.APP_DOMAIN}/uploads/${fileName}`;
    await user.save();

    res.status(200).json({
      success: true,
      status_code: 200,
      path: user.profile_photo,
      message: "Profile photo updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status_code: 500,
      message: `Internal Server Error`,
    });
  }
};

const userForgetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email });

    // generate new password by system
    const password = generateRandomPassword();

    if (!findUser) {
      return res.status(404).json({
        success: false,
        status_code: 404,
        message: "User not found with this mail.",
      });
    }

    const new_password = await hashPassword(password);

    findUser.password = new_password;

    await findUser.save();

    // Send email asynchronously (don't wait for it)
    sendEmail(findUser.name, email, "Your Account Has Been Created", password).catch(
      (err) => {
        console.error("Email sending failed:", err);
      },
    );

    return res.status(200).json({
      success: true,
      status_code: 200,
      message: "Your new password has been sent to the email.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status_code: 500,
      message: `Internal Server Error`,
    });
  }
};

module.exports = {
  userLoginController,
  userLogoutController,
  createOwnerController,
  changePasswordController,
  updateProfilePhotoController,
  userForgetPasswordController,
};
