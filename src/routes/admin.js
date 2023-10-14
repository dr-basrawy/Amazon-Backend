const express = require("express");
const adminModel = require("../models/admins");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const dotenv = require("dotenv")
dotenv.config({ path: "config.env" })
const { saveNewadmin,adminLogin,handleLogout } = require("../controllers/admin");
const credentials = require("../middlewares/credentials");

// router.post("/signup", async (req, res) => {
//   const { adminName, password, email } = req.body;

//   if (!adminName || !password || !email) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     const newAdmin = await saveAdmin(req.body);
//     res.status(201).json({ data: newAdmin });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
router.post("/signup",credentials,saveNewadmin);


router.post("/login",credentials, adminLogin);
router.get("/logout",credentials, handleLogout);





module.exports = router;
