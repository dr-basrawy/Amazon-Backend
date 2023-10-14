const adminModel=require('../models/admins');
const bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");

// function saveAdmin(admin){
//     return adminModel.create(admin)
// }
async function saveNewadmin(req, res) {
    try {
      const admin = req.body;
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(admin.password, salt);
      admin.password = hashedPassword;
  
      const newAdmin = await adminModel.create(admin);
  
     
  
      return res.status(201).json(newAdmin);
    } catch (error) {
      console.error("Error saving new user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
async function adminLogin(req, res) {
    const { email, pwd } = req.body;
    try {
      if (!email || !pwd) {
        return res
          .status(400)
          .json({ message: "Email and password are required." });
      }
      var admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    var isValid = await bcrypt.compare(pwd, admin.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
      const accessToken = jwt.sign(
        { id: admin._id, name: admin.adminName, role: admin.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "45m" }
      );
  
      const refreshToken = jwt.sign(
        { id: admin._id, name: admin.adminName, role: admin.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
      try {
        admin.refreshToken = refreshToken;
        await admin.save();
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
  
        res.json({ accessToken, adminId: admin._id });
      } catch (err) {
        console.error("Error saving refreshToken:", err);
        res.status(500).json({ message: "Internal server error." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;
  
    // Is refreshToken in db?
    const admin = await adminModel.findOne({ refreshToken: refreshToken });
    admin.refreshToken = "";
    await admin.save();
    if (!admin) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.sendStatus(204);
    }
  
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.sendStatus(204);
  };
module.exports = {saveNewadmin,adminLogin,handleLogout}