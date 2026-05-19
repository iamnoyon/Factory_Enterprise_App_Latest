const jwt = require("jsonwebtoken");
const appConfig = require("../config/appConfig");

// Generate a JWT token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, appConfig.jwt_secret, {
    expiresIn: appConfig.jwt_access_token_expiry, // Token expires in 1 hour
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, appConfig.jwt_secret, {
    expiresIn: appConfig.jwt_refresh_token_expiry, // Refresh token expires in 7 days
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, appConfig.jwt_secret);
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
