require("dotenv").config();

const appConfig = {
  port: process.env.APP_PORT || 8001,
  db_url: process.env.DB_URL || "mongodb://localhost:27017/factory",
  smtp_host: process.env.SMTP_HOST || "smtp.gmail.com",
  smtp_user: process.env.SMTP_USERNAME,
  smtp_pass: process.env.SMTP_PASSWORD,
  jwt_secret: process.env.JWT_SECRET || "secretkey",
  jwt_access_token_expiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || "1h",
  jwt_refresh_token_expiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d",
  app_name: process.env.APP_NAME || "Prodex",
};

module.exports = appConfig;
