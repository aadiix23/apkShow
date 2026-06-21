const bcrypt = require("bcrypt");
const { pool } = require("../../config/db")
const jwt = require("jsonwebtoken")
require('dotenv').config();

const register = async(name,email,password)=>{
    let existing = await pool.query(
        "SELECT EMAIL FROM users WHERE email= $1",[email]
    );
    if(existing.rows.length>0){
        const error = new Error("Email Already Registered");
        error.status = 409;
        throw error;
    }
    const passwordHash = await bcrypt.hash(password,12)
    const {rows}= await pool.query(`
        INSERT INTO users(name,email,password_hash)
        VALUES($1,$2,$3)
        RETURNING id,name,email,created_at
        `,[name,email,passwordHash]);

        const user = rows[0];
        console.log("User Registered")
        return user;
}

const login = async(email,password)=>{
   const existingUser = await pool.query(
       "SELECT id,email,password_hash FROM users WHERE email = $1",[email]
   );
   if(existingUser.rows.length===0){
    const error = new Error("Account is Not Registered");
    error.status = 404;
    throw error;
   }
   const user = existingUser.rows[0];
   const isMatch = await bcrypt.compare(password,user.password_hash)
   if(!isMatch){
    const error = new Error("Invalid Credentials");
    error.status = 401;
    throw error;
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
   console.log("User LoggedIN",{
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
const forgotPassword = async ( email ) => {
  const existingUser = await pool.query(
    "SELECT id,email FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length === 0) {
    const error = new Error("Account is Not Registered");
    error.status = 404;
    throw error;
  }

  const user = existingUser.rows[0];
  const resetToken = jwt.sign(
    { userId: user.id, email: user.email }, 
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const resetLink = `${process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`}/reset-password?token=${resetToken}`;

  console.log("Password reset requested", {
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