const express = require("express");
const app = express();
const authRoutes = require("./src/modules/auth/auth.routes")
const appsRoutes = require("./src/modules/app/apps.routes")
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/apps", appsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 400).json({
    Success: false,
    Message: err.message || "Server Error",
  });
});

module.exports=app;