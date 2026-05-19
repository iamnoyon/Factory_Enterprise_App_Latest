const User = require("../models/user.model");
const { verifyToken } = require("../utils/token");

const AuthChecker = (req, res, next) => {
  const token = req.cookies.accessToken || "";

  if (!token) {
    return res.status(401).json({
      success: false,
      status_code: 401,
      message: "Access denied! No token provided.",
    });
  }
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        status_code: 401,
        message: "Invalid token! Please log in again.",
      });
    }
    req.user = decoded; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(500).json({
      success: false,
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};

// Authorization middleware to check if the user has permission to access a resource

const AuthorizationChecker = (requiredPermissions) => {
  return async (req, res, next) => {
    const { id, email, role } = req.user;
    const userPermsissions = await User.findOne({ email: email }).select(
      "permissions",
    );
    if (userPermsissions?.length <= 0) {
      return res.status(403).json({
        success: false,
        status_code: 403,
        message: "Forbidden! User permissions not found.",
      });
    }
    const hasPermission = userPermsissions.permissions.some(
      (permission) => requiredPermissions == permission,
    );
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        status_code: 403,
        message:
          "Forbidden! You don't have permission to access this resource.",
      });
    }
    next();
  };
};

module.exports = {
  AuthChecker,
  AuthorizationChecker,
};
