const express = require("express");
const app = express();
const authRoutes = require("./src/modules/auth/auth.routes")
app.use(express.json());
app.use(authRoutes);
module.exports=app;