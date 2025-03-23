const { sendEmail } = require("../helpers/sendEmail");
const userModels = require("../models/userModels");
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');
async function signUpController(req, res) {
  const { phone, password, email, name, role } = req.body;
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });;
  // send Database
  try {
    const olduseremail = await userModels.findOne({ email });
    // check email
    // res.send(olduseremail)
    if (!olduseremail) {
        
      const user = new userModels({
        name,
        email,
        password,
        phone,
        role,
      });
      await user.save();
        sendEmail(email, otp);
        user.otp = otp;
        await user.save();
        //   otp time validatio
        //   setTimeout( async()=>{
        // user.otp=null;
        // await user.save()
        //   },120000)
      res
        .status(201)
        .json({ msg: "signup crating Success", success: true, data: user });
    }
    else{
        res
        .status(500)
        .json({ msg: "Alrady You have an a Account", success: false });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message ? error.message : message, success: false });
  }
}
async function loginController(req, res) {
  res.send("Login");
}
module.exports = { signUpController, loginController };
