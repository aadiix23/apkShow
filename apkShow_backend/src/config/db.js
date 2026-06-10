require("dotenv").config();
const {Pool}=require("pg")

const pool = new Pool ({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const connectDB= async () => {
    await pool.connect();
    console.log("Database Is Connected")
}
module.exports={pool,connectDB};