const userRouter = require("express").Router();
// Import the user controller
const {
  createUserController,
  getAllUsersController
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

module.exports = userRouter;
