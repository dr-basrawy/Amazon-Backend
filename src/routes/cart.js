const express = require("express");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var { promisify } = require("util");
var router = express.Router();
var {
  getAllcarts,
  getCartByUserId,
  addNewCart,
  addNewProductsInCart,
  removeProductsInCart,
  clearCart,
  updateQuantity,
} = require("../controllers/cart");
const  verifyJWT  = require("../middlewares/verifyJWT");
const Cart = require("../models/cart"); // Adjust the path based on your project structure
const loginAuth = require("../middlewares/auth");
const adminAuth = require("../middlewares/admin_auth");

router.get("/", verifyJWT, adminAuth, async (req, res) => {
  try {
    var users = await getAllcarts();
    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's cart
router.get("/:userId", verifyJWT, async (req, res) => {
  var userId = req.params.userId;
  try {
    var cart = await getCartByUserId(userId);
    console.log(cart);
    if (cart) {
      res.status(200).json({ data: cart });
    }
     else {
      res.status(404).json({ message: `${userId} not found` });
    }
  } catch (err) {
    res.status(404).json({ message: `${userId} not found` });
  }
});

// create new cart for user
router.post("/:userId/newCart", verifyJWT, async (req, res) => {
  var userId = req.params.userId;
  var cart = req.body;
  cart.user = userId;
  try {
    var newcart = await addNewCart(cart);
    res.status(201).json({ data: newcart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// add new product in item in cart
router.post("/:userId/addProductInCart", verifyJWT, async (req, res) => {
  var userId = req.params.userId;
  var products = req.body.items;
  try {
    var newproducts = await addNewProductsInCart(userId, products);
    res.status(201).json({ data: newproducts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
////////
// remove new product in item in cart
router.post(
  "/:userId/removeProductsInCart/:productId",
  verifyJWT,
  async (req, res) => {
    var userId = req.params.userId;
    var productId = req.params.productId;

    try {
      var newproducts = await removeProductsInCart(userId, productId);
      res.status(201).json({ data: newproducts });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.patch("/:userId/clear", verifyJWT, async (req, res) => {
  var userId = req.params.userId;
  try {
    var newcart = await clearCart(userId);
    res.status(201).json({ data: newcart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch(
  "/:userId/updatequantity/:productId/:newquantity",
  verifyJWT,
  async (req, res) => {
    var userId = req.params.userId;
    var productId = req.params.productId;
    var newquantity = req.params.newquantity;
    try {
      var newcart = await updateQuantity(userId, productId, newquantity);
      res.status(201).json({ data: newcart });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
