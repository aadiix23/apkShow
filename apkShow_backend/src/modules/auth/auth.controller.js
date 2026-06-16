const authService = require("../auth/auth.service");

const register = async(req,res)=>{
    try {
    const {name,email,password}=req.body;
    const user = await authService.register(name,email,password,);
    res.status(201).json({Success:true,Message:"Registered Sucessfully",user})
    } catch (error) {
    res.status(400).json({Success:false,Message:error.message})
    }
}
const login = async(req,res)=>{
    try {
        const {email,password}=req.body;
        const loginUser = await authService.login(email,password);
        res.status(201).json({Success:true,Message:"Login Sucessfully",loginUser})
    } catch (error) {
        res.status(400).json({Success:false,Message:error.message})
    }
}
const forgotPassword = async(req,res)=>{
    try {
        const {email} = req.body;
        const forgotPassword = await authService.forgotPassword(email);
        res.status(201).json({Success:true,forgotPassword})

    } catch (error) {
      res.status(400).json({Success:false,Message:error.message})  
    }
}
module.exports={register,login,forgotPassword};