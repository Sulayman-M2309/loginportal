const express=require('express')
const { signupController,loginController, verifyotpController } = require('../../conrollers/authControllers')
const router=express.Router()

// http://localhost:5000/auth/signup
router.post("/signup",signupController)

// http://localhost:5000/auth/login
router.post("/login",loginController)
// http://localhost:5000/auth/verifyotp
router.post("/verifyotp",verifyotpController)
module.exports=router