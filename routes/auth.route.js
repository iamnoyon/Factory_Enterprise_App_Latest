const authRouter = require("express").Router();
// Import the auth controller
const {
  userLoginController,
  userLogoutController,
  createOwnerController,
  changePasswordController,
  updateProfilePhotoController
} = require("../controllers/auth.controller");
const { getCurrentUserController } = require("../controllers/user.controller");
const { AuthChecker } = require("../middlewares/Auth.middleware");

// Define the routes
authRouter.post("/login", userLoginController);
authRouter.post("/logout", AuthChecker, userLogoutController);
authRouter.get("/me", AuthChecker, getCurrentUserController);
authRouter.put("/change-password", AuthChecker, changePasswordController);
authRouter.put("/update-profile-photo", AuthChecker, updateProfilePhotoController);

//create owner
authRouter.post("/create-owner", createOwnerController);

module.exports = authRouter;
