const express = require("express");
const app = express();
const authRoutes = require("./src/modules/auth/auth.routes")
const appsRoutes = require("./src/modules/app/apps.routes")
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/apps", appsRoutes);
module.exports=app;