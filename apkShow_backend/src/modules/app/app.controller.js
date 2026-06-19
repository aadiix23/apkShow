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
const createDemoLink = async (req, res) => {
  try {
    const { appId } = req.body;
    const userId = req.user.userId;

    if (!appId) {
      throw new Error("appId is required");
    }

    const demoLink = await appsService.createDemoLink({ appId, userId });

    const baseUrl = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const shareableLink = `${normalizedBaseUrl}/api/apps/demo/${demoLink.token}`;

    res.status(201).json({
      Success: true,
      Message: "Demo link created successfully",
      demoLink: {
        ...demoLink,
        shareableLink,
        displayName: demoLink.slug,
      },
    });
  } catch (error) {
    res.status(400).json({ Success: false, Message: error.message });
  }
};
const viewDemoLink = async (req, res) => {
  try {
    const { token } = req.params;

    const demoLink = await appsService.getDemoLinkByToken(token);

    if (new Date() > new Date(demoLink.expires_at)) {
      return res.status(410).json({ Success: false, Message: "This demo link has expired" });
    }

    if (!demoLink.is_active) {
      return res.status(410).json({ Success: false, Message: "This demo link is no longer active" });
    }

    if (demoLink.view_time_used_seconds >= demoLink.view_time_limit_seconds) {
      return res.status(410).json({ Success: false, Message: "Demo view time limit reached" });
    }

    res.status(200).json({
      Success: true,
      Message: "Demo link is valid",
      app: {
        appName: demoLink.app_name,
        cloudinaryUrl: demoLink.cloudinary_url,
        packageName: demoLink.package_name,
      },
      remainingSeconds: demoLink.view_time_limit_seconds - demoLink.view_time_used_seconds,
    });
  } catch (error) {
    res.status(404).json({ Success: false, Message: error.message });
  }
};
module.exports = { uploadApp,createDemoLink,viewDemoLink };