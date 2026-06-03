const adminRouter = require("express").Router();
const { getAllPermissionsController } = require("../controllers/admin.controller");
const {
  AuthChecker,
  AuthorizationChecker,
} = require("../middlewares/Auth.middleware");

adminRouter.get(
  "/permissions/list",
  AuthChecker,
//   AuthorizationChecker("view_permission"),
  getAllPermissionsController
);

module.exports = adminRouter;
