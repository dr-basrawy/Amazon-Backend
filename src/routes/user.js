const {
  saveNewUser,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
  report,
  userLogin,
  handleRefreshToken,
  handleLogout
} = require("../controllers/user");
var { addNewCart } = require("../controllers/cart");
const express = require('express')
var { promisify } = require('util')
var router = express.Router()
var { addNewCart } = require('../controllers/cart');
const cors = require("cors");
const multer = require('multer');
const path = require("path");
const { saveFavorite } = require('../controllers/Favorite');
const credentials=require('../middlewares/credentials')
router.use(cors());
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../image")); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

// Single File Route Handler
router.post("/single", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("Single FIle upload success");
});

router.get("/single", async (req, res) => {
  res.sendFile(path.join(__dirname, './image'));

});

router.post("/single", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ message: "File uploaded successfully" });
});

router.post("/signup",credentials,saveNewUser);
router.get("/refresh",credentials, handleRefreshToken);
router.post("/login",credentials, userLogin);
router.get("/logout",credentials, handleLogout);

router.get("/",credentials, async (req, res) => {
  try {
    var users = await getAllUsers();
    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id",credentials, async (req, res) => {
  var id = req.params.id;
  console.log(req.params);

  try {
    var user = await getUserById(id);

    if (user) {
      res.status(200).json({ data: user });
    } else {
      res.status(404).json({ message: `${id} not found` });
    }
  } catch (err) {
    res.status(404).json({ message: `${id} not found` });
  }
});

router.patch("/:id",credentials, async (req, res) => {
  var user = req.body;
  const id = req.params.id;
  updatedat = Date.now();

  try {
    var user = await updateUser(id, user);

    res.status(200).json({ data: user });
  } catch {
    res.status(404).json({ message: `${id} not found` });
  }
});

router.delete("/:id", async (req, res) => {
  var id = req.params.id;

  try {
    var user = await deleteUser(id);

    if (user) {
      res.status(200).json({ data: user });
    } else {
      res.status(404).json({ message: `${id} not found` });
    }
  } catch (err) {
    res.status(404).json({ message: `${id} not found` });
  }
});

router.patch("/:sellerId/report/:userId", async (req, res) => {
  const sellerId = req.params.sellerId;
  const userId = req.params.userId;
  try {
    const newReport = await report(sellerId, userId);
    res.status(200).json({ data: newReport });
  } catch {
    res.status(404).json({ message: `${sellerId} not found` });
  }
});

module.exports = router;
