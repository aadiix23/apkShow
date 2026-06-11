const bcrypt = require("bcrypt");
const crypto = require("crypto");
const pool = require("../config/db")
const jwt = require("jsonwebtoken")
require('dotenv').config();

const register = async({name,email,password})=>{
    let existing = await pool.query(
        "SELECT EMAIL FROM users WHERE email= $1",[email]
    );
    if(existing.rows.length>0){
        throw new appError("Email Already Registered",409)
    }
    const passwordHash = await bcrypt.hash(password,12)
    const {rows}= await pool.query(`
        INSERT INTO users(name,email,password_hash)
        VALUES($1,$2,$3)
        RETURNING id,name,email,created_at
        `,[name,email,passwordHash]);

        const user = rows[0];
        logger.info("User Registered")
        return user;
}

const login = async(email,password)=>{
   const existingUser = await pool.query(
       "SELECT id,email,password_hash FROM users WHERE email = $1",[email]
   );
   if(existingUser.rows.length===0){
    throw new appError("Account is Not Registered",401)
   }
   const user = existingUser.rows[0];
   const isMatch = await bcrypt.compare(password,user.password_hash)
   if(!isMatch){
    throw new appError("Invalid Credentials",401)
   }
   const token = jwt.sign(
    {
    userId:user.id,
    email:user.email,
    },process.env.JWT_SECRET,
    {
        expiresIn:"3d"
    }
   )
   logger.info("User LoggedIN",{
    userId:user.id,
    userEmail:user.email,
   })
  return {
  user: {
    id: user.id,
    email: user.email
  },
  token
};
}
const forgotPassword = async ({ email }) => {
  const existingUser = await pool.query(
    "SELECT id,email FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length === 0) {
    throw new appError("Account is Not Registered", 404);
  }

  const user = existingUser.rows[0];
  const resetToken = jwt.sign(
    { userId: user.id, email: user.email }, 
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const resetLink = `${process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`}/reset-password?token=${resetToken}`;

  logger.info("Password reset requested", {
    userId: user.id,
    userEmail: user.email,
    resetLink,
  });

  return {
    success: true,
    message: "Password reset link generated. Send it to the user via email.",
    resetLink,
    resetToken,
  };
};

module.exports = { register, login,forgotPassword }