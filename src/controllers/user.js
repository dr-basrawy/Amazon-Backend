const sellerModel = require("../models/seller");
const User_model = require("../models/user");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config({ path: "config.env" });

const { getSellerById, updatestatus } = require("./seller");
const { addNewCart } = require("./cart");
const { saveFavorite } = require("./Favorite");

async function saveNewUser(req, res) {
  try {
    const user = req.body;
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    const newUser = await User_model.create(user);

    var newcart ={"user":newUser._id}
    var newfav ={"userId":newUser._id}
    await addNewCart(newcart)
    await saveFavorite(newfav)

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error saving new user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

function getAllUsers() {
  return User_model.find();
}

function deleteUser(id) {
  return User_model.findByIdAndDelete(id, { new: true });
}

function getUserById(id) {
  return User_model.findOne({ _id: id });
}
function updateUser(id, user) {
  return User_model.findByIdAndUpdate(id, user, { new: true });
}

async function report(sellerId, userId) {
  let seller = await getSellerById(sellerId);

  if (seller.usersReport.includes(userId)) {
    return "Already reported";
  } else {
    if (seller.usersReport.length + 1 > 1) {
      if (seller.status != "blocked") {
        await updatestatus(sellerId, "warning");
      }
    }
    newUsersReport = [...seller.usersReport, userId];
    return sellerModel.findByIdAndUpdate(
      { _id: sellerId },
      { usersReport: newUsersReport },
      { new: true }
    );
  }
}
async function userLogin(req, res) {
  const { email, pwd } = req.body;
  try {
    if (!email || !pwd) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    const findUser = await User_model.findOne({ email: email }).exec();
    if (!findUser) {
      return res.status(401).json({ message: "User not found." });
    }
    console.log(findUser.password);
    const match = await bcrypt.compare(pwd, findUser.password);
    console.log(match);
    if (!match) {
      return res.status(401).json({ message: "Invalid password." });
    }
    const accessToken = jwt.sign(
      { id: findUser._id, name: findUser.username, role: findUser.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: findUser._id, name: findUser.username, role: findUser.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    try {
      findUser.refreshToken = refreshToken;
      await findUser.save();
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken, userId: findUser._id });
    } catch (err) {
      console.error("Error saving refreshToken:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function handleRefreshToken(req, res) {
  const cookies = req.cookies.jwt;
  // console.log("getCookies:", cookies);
  if (!cookies) {
    console.log("getCookies:", cookies);
    return res.sendStatus(401);
  }
  const refreshToken = cookies;
  try {
    const findUser = await User_model.findOne({ refreshToken: refreshToken });
    console.log("findUser:", findUser);
    if (!findUser) {
      return res.sendStatus(403);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, encoded) => {
        if (err || findUser._id.toString() !== encoded.id) {
          console.log("encoded : ", encoded);
          console.error(err);
          return res.sendStatus(403);
        }
        const accessToken = jwt.sign(
          { id: encoded.id, name: encoded.userName, role: encoded.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        res.json({ accessToken });
      }
    );
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.sendStatus(500);
  }
}

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User_model.findOne({ refreshToken: refreshToken });
  foundUser.refreshToken = "";
  await foundUser.save();
  if (!foundUser) {
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
module.exports = {
  saveNewUser,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
  report,
  userLogin,
  handleRefreshToken,
  handleLogout,
};
