const express = require("express");
const router = express.Router();
const {
  savesubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subcategory");

router.get("/", async (req, res) => {
  try {
    let subcategories = await getAllSubCategories();
    res.status(201).json({ data: subcategories });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
router.get("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let subcategories = await getSubCategory(id);
    res.status(201).json({ data: subcategories });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let newData = req.body;

    let updateData = await updateSubCategory(id, newData);
    res.status(201).json({ data: updateData });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
router.post("/", async (req, res) => {
  try {
    let subCategory = req.body;
    let newsubCategory = await savesubCategory(subCategory);
    res.status(201).json({ data: newsubCategory });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let deleteSubCat = await deleteSubCategory(id);
    if (deleteSubCat) {
      res.status(200).json({ deleted: true, data: deleteSubCat });
    } else {
      res
        .status(404)
        .json({
          deleted: false,
          data: deleteSubCat,
          message: "subCategory not found",
        });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
