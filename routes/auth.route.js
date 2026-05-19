const authRouter = require("express").Router();
// Import the auth controller
const { userLoginController, userLogoutController } = require("../controllers/auth.controller");
const { AuthChecker } = require("../middlewares/Auth.middleware");

// Define the routes
authRouter.post("/login", userLoginController);
authRouter.post("/logout", AuthChecker, userLogoutController);

module.exports = authRouter;