const {
  saveCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryByName,
  addProductsToCategory,
} = require("../controllers/category");
const express = require("express");
const authMiddleware = require("../middlewares/auth");
const mongoose = require("mongoose");
const Category = require('../models/category ');
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let Category = req.body;
    let newCategory = await saveCategory(Category);
    res.status(201).json({ data: newCategory });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/", async (req, res) => {
  try {
    let Categories = await getAllCategories();
    res.status(201).json({ data: Categories });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const foundCategory = await getCategory(id);

    if (foundCategory) {
      res.status(200).json({ data: foundCategory });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let newData = req.body;

    let updateData = await updateCategory(id, newData);
    res.status(201).json({ data: updateData });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let deleteData = await deleteCategory(id);
    res.status(201).json({ data: deleteData });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/getbyname/:name", async (req, res) => {
  
  let { name } = req.params;
  const pageNumber = req.query.pageNumber || 1;
  const productsPerPage = 12
  // console.log(name);
  try {
    let category = await getCategoryByName(name,pageNumber,productsPerPage);
    res.status(201).json( category  );
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
module.exports = router;
