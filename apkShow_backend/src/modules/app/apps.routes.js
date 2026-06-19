const express = require("express");
const router = express.Router();
const controller = require("./app.controller");
const verifyToken = require("../../middleware/auth.middleware");
const upload = require("../../middleware/multer");

router.post("/upload", verifyToken, upload.single("apk"), controller.uploadApp);
router.post("/demolink", verifyToken, controller.createDemoLink);
router.get("/demo/:token", controller.viewDemoLink);

module.exports = router;