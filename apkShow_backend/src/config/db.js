require("dotenv").config();
const {Pool}=require("pg")

const pool = new Pool ({
  connectionString: process.env.DATABASE_URL,
});

const connectDB= async () => {
    await pool.connect();
    console.log("Database Is Connected")
}
module.exports={pool,connectDB};