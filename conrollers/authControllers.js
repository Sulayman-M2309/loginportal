const { sendEmail } = require("../helpers/sendEmail");
const userModels = require("../models/userModels");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const aleaRNGFactory = require("number-generator/lib/aleaRNGFactory");
async function signupController(req, res) {
  const { name, email, password, phone, role } = req.body;
  const otp = aleaRNGFactory(Date.now()).uInt32().toString().substring(0, 6);
  try {
    const olduseremail = await userModels.findOne({ email });
    if (!olduseremail) {
      bcrypt.hash(password, 10, async function (err, hash) {
        // Store hash in your password DB.
        const user = new userModels({
          name,
          email,
          password: hash,
          phone,
          role,
        });
        await user.save();
        sendEmail(email, otp);
        user.otp = otp;
        await user.save();

        // otp time validatio
        //   setTimeout( async()=>{
        // user.otp=null;
        // await user.save()
        //   },120000)
        res
          .status(201)
          .json({ msg: "signup crating Success", success: true, data: user });
      });
    } else {
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
// Login part 
async function loginController(req, res) {
  const { email, password } = req.body;
try {
  const existinguser = await userModels.findOne({ email });
  if (!existinguser) {
    return res.status(404).json({ success: false, msg: "email not found" });
  }else{
    bcrypt.compare(password,existinguser.password,async function(err, result) {
      const user = await userModels.findOne({ email }).select("-password");
      // res.send(result)
      if(result){
        if(existinguser.role=="user"){
          const token = jwt.sign({ user }, process.env.JWT_Scret);
          return res
          .status(200)
          .json({ success: true, msg: "User Login Successfully",data:user,token:token });
        }else if(existinguser.role=="admin"){
          const token = jwt.sign({ user }, process.env.JWT_Scret,{ expiresIn: '1h' });
          return res
          .status(200)
          .json({ success: true, msg: "User Login Successfully",data:user ,token:token });
        }
        return res
        .status(200)
        .json({ success: true, msg: "Login Successfully",data:user });

      }
      else{
        return res
        .status(404)
        .json({ msg: "Invalid Password", success: false });
      }
  });
  }
} catch (error) {
  res
  .status(500)
  .json({ error: error.message ? error.message : message, success: false });
}
}
// otp verify system
async function verifyotpController(req, res) {
  const { email, otp } = req.body;
  try {
    const existinguser = await userModels.findOne({ email });
    if (existinguser) {
      if (existinguser.otp == otp) {
        (existinguser.isverify = true), (existinguser.otp = null);
        await existinguser.save();
        res.status(200).json({ success: true, msg: "otp successful" });
      } else {
        res.status(404).json({ error: "otp invalid", success: false });
      }
    } else {
      res.status(404).json({ error: "user not found", success: false });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message ? error.message : message, success: false });
  }
}
module.exports = { signupController, loginController,verifyotpController };
