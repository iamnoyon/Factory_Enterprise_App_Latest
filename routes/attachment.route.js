const {
  attachmentUploadController,
} = require("../controllers/attachment.controller");
const { AuthChecker } = require("../middlewares/Auth.middleware");
const { upload } = require("../utils/attachment");

const attachmentRouter = require("express").Router();

// routes
attachmentRouter.post(
  "/upload",
  AuthChecker,
  upload.single("attachment"),
  attachmentUploadController,
);

module.exports = attachmentRouter;
