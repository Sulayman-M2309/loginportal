const express=require('express')
const { signUpController,loginController } = require('../../conrollers/authControllers')
const router=express.Router()

// http://localhost:5000/auth/signup
router.post("/signup",signUpController)

// http://localhost:5000/auth/login
router.post("/login",loginController)
module.exports=router