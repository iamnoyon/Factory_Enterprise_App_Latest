const attachmentUploadController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "No file uploaded",
      });
    }
    // Process the uploaded file
    res.status(200).json({
      success: true,
      status_code: 200,
      message: "File uploaded successfully",
      filename: req.file.filename,
      path: req.file.path,
    });
    // ...
  } catch (error) {
    console.error("Error uploading attachment:", error);
    return res.status(500).json({
      success: false,
      status_code: 500,
      message: "Internal server error",
    });
  }
};

module.exports = {
  attachmentUploadController,
};
