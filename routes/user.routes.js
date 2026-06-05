const userRouter = require("express").Router();
// Import the user controller
const {
  createUserController,
  getAllUsersController,
  getUserDropdownWithPermissionsController,
  updateUserStatusController
} = require("../controllers/user.controller");
const {
  AuthChecker,
  AuthorizationChecker,
} = require("../middlewares/Auth.middleware");

// Define the routes
userRouter.post(
  "/create",
  AuthChecker,
  AuthorizationChecker("create_user"),
  createUserController,
);

userRouter.get(
  "/list",
  AuthChecker,
  AuthorizationChecker("read_user"),
  getAllUsersController
)

userRouter.get(
  '/dropdown-with-permissions',
  AuthChecker,
  AuthorizationChecker("read_user"),
  getUserDropdownWithPermissionsController
)

userRouter.put(
  '/update-status/:id',
  AuthChecker,
  AuthorizationChecker("update_user"),
  updateUserStatusController
)

module.exports = userRouter;
