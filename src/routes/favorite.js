const express = require("express");
const router = express.Router();
const {
  saveFavorite,
  getAllFavorites,
  getFavoriteByUserId,
  addNewProductsInFav,
  removeProductsInFav
} = require("../controllers/Favorite");

try {
} catch (err) {}

// Create a new favorite
router.post("/", async (req, res) => {
  try {
    const favorite = req.body;
    const newFav = await saveFavorite(favorite);
    res.status(201).json({ message: "Favorite created", data: newFav });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Read all favorites
router.get("/", async (req, res) => {
  try {
    let favorites = await getAllFavorites();
    res.status(201).json({ data: favorites });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Read a specific Favorite by userID
router.get("/:userId", async (req, res) => {
  let userId = req.params.userId;
  try {
    let favorites = await getFavoriteByUserId(userId);
    res.status(201).json({ data: favorites });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// adds a product to a user's favorites
router.post('/:userId/addProductInFav/:productId', async (req, res) => {
  var userId = req.params.userId
  var products = req.params.productId
  // console.log(userId);
   try {
       var newproducts = await addNewProductsInFav(userId,products)
       res.status(201).json({ data: newproducts })
   } catch (err) {
       res.status(500).json({ message: err.message })
   }
});

// removes a product from a user's favorites
router.post('/:userId/removeProductsInFav/:productId', async (req, res) => {
  var userId = req.params.userId
  var productId = req.params.productId
  console.log(userId);
  console.log(productId);
   try {
       var newproducts = await removeProductsInFav(userId,productId)
       res.status(201).json({ data: newproducts })
   } catch (err) {
       res.status(500).json({ message: err.message })
   }
});

// Update a favorite by ID
router.patch("/:id",async (req, res) => {
  try {
    let favoriteId = req.params;
    let newData = req.body;
    let updatedFavorite = await updateFavorite(favoriteId,newData)
    res.status(201).json({ data: updatedFavorite, message: "Favorite updated" })
  } catch{
    res.status(404).json({ message: "Favorite not found" });
  }
});

// Delete a favorite by ID
router.delete("/:id", async (req, res) => {
  try {
    let favoriteId = req.params;
    let deleteData = await deleteFavorite(favoriteId);
    res.status(201).json({ data: deleteData, message: "Favorite deleted" })
  } catch (err) {
    res.status(404).json({ message: "Favorite not found" });
  }
});

module.exports = router;
