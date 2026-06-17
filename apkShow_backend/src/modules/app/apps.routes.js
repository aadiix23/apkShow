const express = require("express");
const router = express.Router();
const controller = require("./apps.controller");
const verifyToken = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

router.post("/upload", verifyToken, upload.single("apk"), controller.uploadApp);

module.exports = router;