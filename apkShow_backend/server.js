const dotenv = require("dotenv")
const database = require("./src/config/db")
const app = require("./app")
dotenv.config()

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await database.connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
