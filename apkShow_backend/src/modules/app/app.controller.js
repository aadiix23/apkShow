const appsService = require("./app.service");

const uploadApp = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No APK file uploaded");
    }

    const { appName } = req.body;
    if (!appName) {
      throw new Error("appName is required");
    }

    const userId = req.user.userId;

    const cloudinaryResult = await appsService.uploadApkToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    const appRecord = await appsService.createAppRecord({
      userId,
      originalFilename: req.file.originalname,
      cloudinaryUrl: cloudinaryResult.secure_url,
      fileSizeBytes: req.file.size,
      appName,
    });

    res.status(201).json({ Success: true, Message: "APK Uploaded Successfully", app: appRecord });
  } catch (error) {
    res.status(400).json({ Success: false, Message: error.message });
  }
};

module.exports = { uploadApp };